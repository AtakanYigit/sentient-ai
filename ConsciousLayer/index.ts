// import {OpenAI}                from "openai";
import {GoogleGenerativeAI, SchemaType, Schema} from "@google/generative-ai";
import {DB, pgListener}        from "./config/database";
import {Context}               from "./src/entities/Context";
import {Vitals}                from "./src/entities/Vitals";
import {ShortTermMemories}     from "./src/entities/ShortTermMemories";
import sendActionToMemoryLayer from "./src/utils/sendActionToMemoryLayer";
import axios                   from "axios";
// import {zodResponseFormat}     from "openai/helpers/zod";
// import {z}                     from "zod";

const ContextRepository           = DB.getRepository(Context);
const VitalsRepository            = DB.getRepository(Vitals);
const ShortTermMemoriesRepository = DB.getRepository(ShortTermMemories);

require("dotenv").config({ path: '../.env' });

console.log("Conscious Layer Started");

// const openai = new OpenAI({
//     baseURL: process.env.LLM_BASE_URL,
//     apiKey: process.env.OPENAI_API_KEY || "not-needed"
// });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY as string);
const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_GENERATIVE_AI_MODEL || "gemini-1.5-flash" });

// const actionSchema = 
//     z.object({
//         action: z.enum(["say", "move", "do nothing"]),
//         value: z.string(),
//         tone: z.enum(["natural", "fierce", "whisper"])
//     })

const actionResponseSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        action: { type: SchemaType.STRING, enum: ["say", "move", "do nothing"] },
        value: { type: SchemaType.STRING },
        tone: { type: SchemaType.STRING, enum: ["natural", "fierce", "whisper"] }
    },
    required: ["action", "value", "tone"]
};

const processDataAndTakeAction = async (channel: string) => {
    console.log("------------------PROCESSING DATA AND TAKING ACTION------------------");
    console.log("channel: ", channel);

    const lastAction = await ShortTermMemoriesRepository.findOne({
        where: {
            type: "action"
        },
        order: {
            createdAt: "DESC"
        }
    });

    let timeSinceLastAction = null;
    if (lastAction) {
        timeSinceLastAction = new Date().getTime() - lastAction.createdAt.getTime();
    }

    try {        
        const res = await axios.post(`http://localhost:${process.env.THOUGHT_LAYER_PORT}/api/think/possible-actions-and-outcomes`);
        const actions = res.data;
        console.log("actions: ", actions);
        console.log("actions?.options: ", actions?.options);

        const prompt = `
            You are the conscious layer of the brain.
            You are given a list of possible actions and outcomes. You need to choose the best action to take. You are allowed to choose "do nothing" if you think it's not necessary. ${timeSinceLastAction ? `It has been ${timeSinceLastAction}ms since the last action you've taken.` : ""}
            If you choose to say something, you need to provide the text you want to say and the tone you want to express. You can choose one of the following tones:
            - natural
            - fierce
            - whisper
            
            If you choose to say something, you need to return "say" as the action and the text you want to say as the value. Use punctuation to express your emotion.
            If you choose to do nothing, you need to return "do nothing" as the action and "do nothing" string as the value.

            Example Output 1:
            {
                "action": "say",
                "value": "Hello, nice to meet you!",
                "tone": "natural"
            }

            Example Output 2:
            {
                "action": "say",
                "value": "I hate you!!",
                "tone": "fierce"
            }

            Example Output 3:
            {
                "action": "say",
                "value": "We better be quiet, I love you!!",
                "tone": "whisper"
            }

            Example Output 4:
            {
                "action": "do nothing",
                "value": "do nothing",
                "tone": "natural"
            }
            
            Here are the possible actions:
            ${actions}
        `;

        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: prompt }] }
            ],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: actionResponseSchema
            }
        });

        console.log("------------------ACTION TAKEN------------------");
        const actionJson = result.response.text();
        const { action, value, tone } = JSON.parse(actionJson);
        console.log(action, value, tone);

        if (action === "say") {
            axios.post(`http://localhost:${process.env.MOTOR_FUNCTIONS_LAYER_PORT}/api/speech`, {text: value, tone: tone.toLowerCase()});
        }else if (action === "do nothing") {
            console.log("No action taken");
        }

    } catch (error) {
        console.error("Error in ConsciousLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    }
};

const setupListeners = async () => {
    try {
        await pgListener.connect();
        
        // Subscribe to all table changes
        await pgListener.listenTo("context_changes");
        await pgListener.listenTo("vitals_changes");
        await pgListener.listenTo("short_term_memories_changes");
        await pgListener.listenTo("past_visions_changes");
        
        // Handle notifications with the channel name
        pgListener.notifications.on("context_changes", () => processDataAndTakeAction("context_changes"));
        pgListener.notifications.on("vitals_changes", () => processDataAndTakeAction("vitals_changes"));
        pgListener.notifications.on("short_term_memories_changes", () => processDataAndTakeAction("short_term_memories_changes"));
        pgListener.notifications.on("past_visions_changes", () => processDataAndTakeAction("past_visions_changes"));
    } catch (error) {
        console.error("Error setting up database listeners in ConsciousLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    }
};

// Initialize database and listeners
DB.initialize()
    .then(() => {
        console.log("Database initialized");
        setupListeners();
    })
    .catch((error) => {
        console.error("Error initializing database in ConsciousLayer/index.ts:");
        if(process.env.DEBUG === "ON") {
            console.error(error);
        }
    });

// Handle cleanup on exit
process.on("exit", () => {
    pgListener.close();
});