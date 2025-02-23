import {OpenAI}            from "openai";
import {DB}                from "./config/database";
import {Context}           from "./src/entities/Context";
import {Vitals}            from "./src/entities/Vitals";
import axios               from "axios";

const vitalsRepository = DB.getRepository(Vitals);
const contextRepository = DB.getRepository(Context);

const openai = new OpenAI({
    baseURL: `http://localhost:${process.env.LM_SERVER_PORT}/v1`,
    apiKey: "not-needed"
});

const fetchAndProcessContext = async () => {
    try {
        if (!DB.isInitialized) {
            await DB.initialize();
        }

        // Get the context from database
        const prevContext = await contextRepository.findOne({
            where: { createdAt: new Date(Date.now() - 60000) },
            order: { createdAt: "DESC" },
        });

        const vitals = await vitalsRepository.find();
        const visual = null;
        const audio = null;
        const latestAction = null;
        const latestInteractions = null;

        let emotionsResponse = await axios.get(`http://localhost:${process.env.EMOTIONS_SERVER_PORT}/api/emotions`);
        let emotions = emotionsResponse?.data?.sort((a: any, b: any) => a.distance - b.distance);
            emotions = emotions?.slice(0, 3);

        const prompt = `
            You are the deep thinking layer of the brain and you are provided with:
            - Your body's current vital values.
            - A list of currently and past (15 seconds ago) most intense emotions you are feeling, and intensity of each emotion.
            - Context generated 15 seconds ago (Previous context). If there is no previous context, use the current context.
            - You might receive other information depending on your body. Such as visual, auditory, recent reflexes, recent actions and interactions, etc.
            
            Your task is to think about the previous context and the current vital values and emotions and generate a new context you are in. Explain current situation in detail. Make sure context is clear as it will be used by other layers to understand current situation.
            - Do not include any other text than the answer.
            - Do not include emotion intensities in the answer.
            - Do not generate anything else that is not provided in the input. Do not hallucinate. Do not make assumptions. Do not make up anything.

            Example 1:
            Your current vital values - Sleep: 30/100, Hunger: 35/100
            You were feeling (15 seconds ago) - Nervous: 8/10, Sad: 3/10, Tired: 2/10
            You are currently feeling - Nervous: 6/10, Sad: 2/10, Tired: 2/10
            Visual: A man (25 Male, 180cm, 70kg, named John, wearing a suit and glasses, smiling) is talking to me. We are in an office. There is a table between us. There is a laptop on the table. On the laptop there is a document with a graph on it.
            Previous context: Interviewer (John) is asking me questions about the graph on the laptop. Last question was "What do you think is the main message of this graph?". I feel nervous. Laptop looks like it is a MacBook Pro. Graph is about the stock market.
            Answer: Interviewer (John) is asking me questions about the graph on the laptop. Last question was "What do you think is the main message of this graph?". Laptop looks like it is a MacBook Pro. Graph is about the stock market. I answered that "Main message is that the stock market is going up". I still feel nervous but relieved a little because I answered the question correctly.

            Example 2:
            Your current vital values - Sleep: 30/100, Hunger: 35/100
            You were feeling (15 seconds ago) - Nervous: 6/10, Sad: 2/10, Tired: 2/10
            You are currently feeling - Nervous: 5/10, happy: 5/10, Tired: 2/10
            Visual: A man (25 Male, 180cm, 70kg, named John, wearing a suit and glasses, smiling) is talking to me. We are in an office. There is a table between us. There is a laptop and documents on the table. We are shaking hands.
            Previous context: Interviewer (John) is asking me questions about the graph on the laptop. Last question was "What do you think is the main message of this graph?". Laptop looks like it is a MacBook Pro. Graph is about the stock market. I answered that "Main message is that the stock market is going up". I still feel nervous but relieved a little because I answered the question correctly.
            Answer: I am shaking hands with John. I am feeling happier and more relaxed. We are shaking hands and discussing my employment. He is giving me a job offer.

            Example 3:
            Your current vital values - Sleep: 30/100, Hunger: 35/100
            You were feeling (15 seconds ago) - Nervous: 6/10, Sad: 2/10, Tired: 2/10
            You are currently feeling - Nervous: 5/10, happy: 5/10, Tired: 2/10
            Visual: There are textbooks on the table. I am reading a textbook about huffman coding and compression algorithms. There are some notes on the table. There is a coffee and couple pencils on the table.
            Audio: Room is quiet. I can hear rain outside.
            Previous context: I have been studying for an upcoming exam. I was reviewing my notes and reading a textbook. I am feeling tired and nervous.
            Answer: I take a sip of my coffee and continue writing in my notebook. The library is peaceful, making it easy to concentrate. I feel more confident about the material I am studying. A librarian walks by, quietly organizing books on a nearby shelf.

            Now provide your answer.
            Your vital values: ${vitals.map((vital: any) => `${vital.name}: ${vital.value}/100,`).join(" and ")}.
            You are feeling ${emotions.map((emotion: any) => `${emotion.name}: ${Math.round(10 - emotion.distance)}/10,`).join(" and ")}.
            Previous context: ${prevContext?.context}
            ${visual ? `Visual: ${visual}` : ""}
            ${audio ? `Audio: ${audio}` : ""}
            ${latestAction ? `Latest action: ${latestAction}` : ""}
            ${latestInteractions ? `Latest interactions: ${latestInteractions}` : ""}
        `;

        const response = await openai.chat.completions.create({
            model: "local-model",
            messages: [
                { 
                    role: "user", 
                    content: prompt,
                }
            ],
        });

        const newContext = new Context();
        newContext.context = response.choices[0].message.content;
        await contextRepository.save(newContext);

        console.log("API Response:", response.choices[0].message.content);
    } catch (error) {
        console.error("Error in context processing:", error);
    }
};

// Start the loop
const startContextMonitoring = () => {
    fetchAndProcessContext();

    setInterval(fetchAndProcessContext, 30000);
};

// Initialize the monitoring
startContextMonitoring();