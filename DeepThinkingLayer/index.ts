// import {OpenAI}            from "openai";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {DB}                from "./config/database";
import {Context}           from "./src/entities/Context";
import {Vitals}            from "./src/entities/Vitals";
import {ShortTermMemories} from "./src/entities/ShortTermMemories";
import axios               from "axios";

const vitalsRepository = DB.getRepository(Vitals);
const contextRepository = DB.getRepository(Context);
const shortTermMemoriesRepository = DB.getRepository(ShortTermMemories);

require("dotenv").config({ path: '../.env' });

// const openai = new OpenAI({
//     baseURL: process.env.LLM_BASE_URL,
//     apiKey: process.env.OPENAI_API_KEY || "not-needed"
// });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY as string);
const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_GENERATIVE_AI_MODEL || "gemini-1.5-flash" });

const fetchAndProcessContext = async () => {
    try {
        // Fetch all data in parallel
        const [prevContext, lastVision, vitals, emotionsResponse] = await Promise.all([
            contextRepository.findOne({
                where: { createdAt: new Date(Date.now() - 60000) },
                order: { createdAt: "DESC" },
            }),

            shortTermMemoriesRepository.findOne({
                where: { createdAt: new Date(Date.now() - 60000), type: "vision" },
                order: { createdAt: "DESC" },
            }),
            
            vitalsRepository.find(),
            
            axios.get<Array<{ name: string; distance: number }>>(`http://localhost:${process.env.EMOTIONS_LAYER_PORT}/api/emotions`)
        ]);

        // Process emotions data
        const emotions = emotionsResponse?.data?.sort((a, b) => a.distance - b.distance)?.slice(0, 3);

        if (!emotions) {
            throw new Error("Failed to fetch emotions data");
        }

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
            If there aren't sufficient information to generate a context, you can say "Context is blank, not much information is available".
            If you don't have any information to generate a context, you can say "Context is blank, not much information is available".
            If there is no visual or auditory information, you can say "No visual or auditory information is available. Context is blank".
            You are forbidden to generate any information that is not provided in the input. Do not hallucinate. Do not make assumptions. Do not make up anything.
            Never speak in third person. All information is about you. All the actions are yours. Everything you saw, heard, felt, smelled, etc. is from your body.
            
            Here are some examples:
            Example 1:
            Your current vital values - Sleep: 30/100, Hunger: 35/100
            You are currently feeling - Nervous: 6/10, Sad: 2/10, Tired: 2/10
            Visual: A man (25 Male, 180cm, 70kg, named John, wearing a suit and glasses, smiling) is talking to me. We are in an office. There is a table between us. There is a laptop on the table. On the laptop there is a document with a graph on it.
            Audio: 
            - I hear "What do you think is the main message of this graph?"
            - I hear "I am asking you this question because I want to know your opinion on this matter."
            Previous context: Interviewer (John) is asking me questions about the graph on the laptop. Last question was "What do you think is the main message of this graph?". I feel nervous. Laptop looks like it is a MacBook Pro. Graph is about the stock market.
            Answer: Interviewer (John) is asking me questions about the graph on the laptop. Last question was "What do you think is the main message of this graph?". Laptop looks like it is a MacBook Pro. Graph is about the stock market. I answered that "Main message is that the stock market is going up". I still feel nervous but relieved a little because I answered the question correctly.

            Example 2:
            Your current vital values - Sleep: 30/100, Hunger: 35/100
            You are currently feeling - Nervous: 5/10, happy: 5/10, Tired: 2/10
            Visual: A man (25 Male, 180cm, 70kg, named John, wearing a suit and glasses, smiling) is talking to me. We are in an office. There is a table between us. There is a laptop and documents on the table. We are shaking hands.
            Previous context: Interviewer (John) is asking me questions about the graph on the laptop. Last question was "What do you think is the main message of this graph?". Laptop looks like it is a MacBook Pro. Graph is about the stock market. I answered that "Main message is that the stock market is going up". I still feel nervous but relieved a little because I answered the question correctly.
            Answer: I am shaking hands with John. I am feeling happier and more relaxed. We are shaking hands and discussing my employment. He is giving me a job offer.

            Example 3:
            Your current vital values - Sleep: 30/100, Hunger: 35/100
            You are currently feeling - Nervous: 5/10, happy: 5/10, Tired: 2/10
            Visual: There are textbooks on the table. I am reading a textbook about huffman coding and compression algorithms. There are some notes on the table. There is a coffee and couple pencils on the table.
            Audio: Room is quiet. I can hear rain outside.
            Actions: I take a sip of my coffee. I continue writing in my notebook. I flip the page of my textbook.
            Previous context: I have been studying for an upcoming exam. I was reviewing my notes and reading a textbook. I am feeling tired and nervous.
            Answer: I take a sip of my coffee and continue writing in my notebook. The library is peaceful, making it easy to concentrate. I feel more confident about the material I am studying. A librarian walks by, quietly organizing books on a nearby shelf.

            Example 4:
            Your current vital values - Sleep: 30/100, Hunger: 35/100
            You are currently feeling - Nervous: 5/10, happy: 5/10, Tired: 2/10
            Visual: null
            Audio: null
            Previous context: I have been studying for an upcoming exam. I was reviewing my notes and reading a textbook. I am feeling tired and nervous.
            Answer: No visual or auditory information is available. Context is blank.

            Example 5:
            Your current vital values - Sleep: 30/100, Hunger: 35/100
            You are currently feeling - Nervous: 5/10, happy: 5/10, Tired: 2/10
            Visual: null
            Audio: null
            Previous context: Interviewer (John) is asking me questions about the graph on the laptop. Last question was "What do you think is the main message of this graph?". Laptop looks like it is a MacBook Pro. Graph is about the stock market. I answered that "Main message is that the stock market is going up". I still feel nervous but relieved a little because I answered the question correctly.
            Answer: No visual or auditory information is available. Context is blank.

            Now provide your answer.
            Your vital values: ${vitals.map(vital => `${vital.name}: ${vital.level}/100`).join(", ")}.
            You are feeling ${emotions.map(emotion => `${emotion.name}: ${Math.round(10 - emotion.distance)}/10`).join(", ")}.
            Previous context: ${prevContext?.context || "No previous context available"}
            ${lastVision ? `Last vision: ${lastVision.action}` : ""}
        `;

        // console.log(prompt);

        const response = await model.generateContent(prompt.trim());
        const text = response.response.text();

        if(text) {
            const newContext = new Context();
            newContext.context = text;
            await contextRepository.save(newContext);

            console.log("API Response:", text);
        } else {
            console.error("No response from Google Generative AI in DeepThinkingLayer/index.ts:");
        }
    } catch (error) {
        console.error("Error in context processing in DeepThinkingLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
        // Don't re-throw - let the interval continue on next iteration
    }
};

const waitForEmotionsLayer = async (retries = 3, delay = 2000): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
        try {
            await axios.get(`http://localhost:${process.env.EMOTIONS_LAYER_PORT}/api/emotions`);
            console.log("EmotionsLayer is ready");
            return true;
        } catch (error) {
            console.log(`Waiting for EmotionsLayer to start... (attempt ${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return false;
};

const init = async () => {
    try {
        await DB.initialize();
        console.log("Database initialized");
        
        // Wait for EmotionsLayer to be ready before starting
        const isEmotionsLayerReady = await waitForEmotionsLayer();
        
        if (!isEmotionsLayerReady) {
            console.warn("EmotionsLayer not available after retries. DeepThinkingLayer will continue but may encounter errors.");
        }
        
        fetchAndProcessContext();
        setInterval(fetchAndProcessContext, parseInt(process.env.DEEP_THINKING_LAYER_INTERVAL) || 30000);
    } catch (error) {
        console.error("Error initializing database in DeepThinkingLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    }
};

init();