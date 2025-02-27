import {OpenAI}                from "openai";
import {DB, pgListener}        from "./config/database";
import {Context}               from "./src/entities/Context";
import {Vitals}                from "./src/entities/Vitals";
import {ShortTermMemories}     from "./src/entities/ShortTermMemories";
import sendActionToMemoryLayer from "./src/utils/sendActionToMemoryLayer";
import axios                   from "axios";
import {zodResponseFormat}     from "openai/helpers/zod";
import {z}                     from "zod";

const ContextRepository           = DB.getRepository(Context);
const VitalsRepository            = DB.getRepository(Vitals);
const ShortTermMemoriesRepository = DB.getRepository(ShortTermMemories);

require("dotenv").config({ path: '../.env' });

console.log("Conscious Layer Started");

const openai = new OpenAI({
    baseURL: `http://localhost:${process.env.LM_SERVER_PORT}/v1`,
    apiKey: "not-needed"
});

const actionSchema = 
    z.object({
        action: z.enum(["say", "do nothing"]),
        value: z.string().optional()
    }).refine(data => {
        // if (["say", "move"].includes(data.action) && !data.value) {
        if (["say"].includes(data.action) && !data.value) {
            return false;
        }
        // Ensure value is empty when action is "do nothing"
        if (data.action === "do nothing" && data.value) {
            return false;
        }
        return true;
    }, {
        // message: "Value must be provided for 'say' and 'move' actions, and must be empty for 'do nothing' action"
        message: "Value must be provided for 'say' action"
    });

const processDataAndTakeAction = async (channel: string) => {
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
        const res = await axios.post(`http://localhost:${process.env.THOUGHT_LAYER_PORT}/api/think/possible-actions-and-outcomes`, {
            prompt: "What should I do?"
        });

        const actions = res.data;

        const prompt = `
            You are the conscious layer of the brain.
            You are given a list of possible actions and outcomes. You need to choose the best action to take. You are allowed to choose "do nothing" if you think it's not necessary. ${timeSinceLastAction ? `It has been ${timeSinceLastAction}ms since the last action you've taken.` : ""}
            Here are the possible actions:
            ${actions}
        `;

        const actionTaken = await openai.chat.completions.create({
            model: "local-model",
            messages: [
                { 
                    role: "user", 
                    content: prompt,
                }
            ],
            response_format: zodResponseFormat(actionSchema, "json_schema")
        });

        console.log(actionTaken.choices[0].message.content);

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