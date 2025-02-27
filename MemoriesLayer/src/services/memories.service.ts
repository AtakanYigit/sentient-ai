import OpenAI              from "openai";
import axios               from "axios";
import {z}                 from "zod";
import {zodResponseFormat} from "openai/helpers/zod";
import {DB}                from "../config/database";
import {Vitals}            from "../entities/Vitals";
import {Context}           from "../entities/Context";
import {LongTermMemories}  from "../entities/LongTermMemories";
import {ShortTermMemories} from "../entities/ShortTermMemories";

const longTermMemoriesRepository  = DB.getRepository(LongTermMemories);
const shortTermMemoriesRepository = DB.getRepository(ShortTermMemories);
const vitalsRepository            = DB.getRepository(Vitals);
const contextRepository           = DB.getRepository(Context);

require("dotenv").config({ path: '../.env' });

const openai = new OpenAI({
    baseURL: `http://localhost:${process.env.LM_SERVER_PORT}/v1`,
    apiKey: "not-needed"
});

export const MemoriesService = {
    processAction: async (action: string, type: string) => {
        try {
            const longTermMemorySchema = z.object({
                saveInLongTermMemory: z.boolean(),
                memory: z.string(),
                levelOfImportance: z.number().min(1).max(3),
            });
            
            let emotionsResponse = await axios.get(`http://localhost:${process.env.EMOTIONS_LAYER_PORT}/api/emotions`);
            let emotions = emotionsResponse.data.sort((a: any, b: any) => a.distance - b.distance);
                emotions = emotions.slice(0, 3);

            const vitals = await vitalsRepository.find();

            const context = await contextRepository.findOne({
                where: { createdAt: new Date(Date.now() - 60000) },
                order: { createdAt: "DESC" },
            });

            const prompt = `
                You are the memory layer of the brain and other layers are providing you with 
                - The most recent action you took
                - A context(optional)
                - You might receive other information depending on your body. Such as emotions, vitals, visual, auditory, recent reflexes, recent actions and interactions, etc.
                You need to decide whether the latest action is important enough to be remembered in the long term memory or only short term memory.
                Don't forget, long term memory is expensive to maintain, so it should only be used for important actions that need to be remembered for a long time. Every action you store in long term memory will also be stored in the short term memory. Do not add simple questions or basic interactions in the long term memory.
                Do not store actions that are not really vital in the long term in the long-term memory.

                You also need to decide the level of importance of the action. (1-3).
                - Level 1: Important enough to be remembered for a long time. Things that got you excited, things that you regret not doing, things that you regret doing, etc.
                - Level 2: Important to be remembered for a medium time. Important conversations, important decisions, important actions, etc.
                - Level 3: Very important to be remembered immediately. Your most important actions, your most important conversations, your most important decisions, etc. and things that you need to access a lot.

                Short term memory is cheap to maintain. Memories in short term memory are forgotten after 60 seconds. 
                You need to return a boolean value. If the action should be stored in long term memory, return true. If it should be stored in short term memory, return false.
                You also need to return the memory that you need to store in the long term memory. It doesn't need to be the action itself, it can be a short summary of the action or situation.
                If the action is important enough save it in long term memory wether or not emotions are high or low. If an action is in the middle, consider the emotions and other information to decide.

                Here are some examples:
                Example 1:
                Your vital values: ${vitals.map((vital: any) => `${vital.name}: ${vital.value}/100,`).join(" and ")}.
                You are feeling ${emotions.map((emotion: any) => `${emotion.name}: ${Math.round(10 - emotion.distance)}/10,`).join(" and ")}
                Action: "I ate a pizza"
                Return: { saveInLongTermMemory: false, memory: "" }
            
                Example 2:
                Action: "I went to the gym"
                Return: { saveInLongTermMemory: false, memory: "I went to the gym" }
            
                Example 3:
                Action: "I met a new friend at the gym. He is called John Doe."
                Return: { saveInLongTermMemory: true, memory: "I met John Doe at the gym." }

                Example 4:
                You are feeling: Bored: 6/10, Sad: 4/10, Lonely: 3/10
                Action: "A random girl asked for directions. I told her to go to the left."
                Return: { saveInLongTermMemory: false, memory: "" }

                Example 5:
                You are feeling: Nervous: 8/10, Happy: 7/10, Neutral: 4/10
                Action: "A random girl asked for directions. I told her to go to the left."
                Return: { 
                    saveInLongTermMemory: true, 
                    memory: "A random, beautiful girl asked for directions. I told her to go to the left. I felt nervous and excited at the same time.", 
                    levelOfImportance: {
                        1,
                    }
                }

                Example 6:
                Action: "I am feeling hungry"
                Return: { saveInLongTermMemory: false, memory: "" }

                Example 7:
                You are feeling: Bored: 6/10, Sad: 4/10, Lonely: 3/10
                Action: "I see a bird on the deck. It is lightly coloured. It is a sparrow eating a worm."
                Return: { saveInLongTermMemory: false, memory: "" }

                Example 8:
                Action: "What is the capital of France?"
                Return: { saveInLongTermMemory: false, memory: "" }

                Example 9:
                Action: "Hello, how are you?"
                Return: { saveInLongTermMemory: false, memory: "" }

                Example 10:
                Action: "What is your name?"
                Return: { saveInLongTermMemory: false, memory: "" }

                Here is the current situation:
                Your vital values: ${vitals.map((vital: any) => `${vital.name}: ${vital.value}/100,`).join(" and ")}.
                You are feeling ${emotions.map((emotion: any) => `${emotion.name}: ${Math.round(10 - emotion.distance)}/10,`).join(", ")}.
                Context: ${context?.context}
                Latest Action: ${action}
            `;
            
            const response = await openai.chat.completions.create({
                model: "local-model",
                messages: [
                    { 
                        role: "user", 
                        content: prompt,
                    }
                ],
                response_format: zodResponseFormat(longTermMemorySchema, "json_schema")
            });
            
            const { saveInLongTermMemory, memory, levelOfImportance } = JSON.parse(response.choices[0].message.content);
            console.log(saveInLongTermMemory, memory, levelOfImportance);

            let longTermMemory;

            if(saveInLongTermMemory) {
                longTermMemory = longTermMemoriesRepository.save({
                    memory: memory,
                    levelOfImportance: Number(levelOfImportance),
                    createdAt: new Date(),
                });
            }

            const shortTermMemory = shortTermMemoriesRepository.save({
                action: action,
                type: type,
                createdAt: new Date(),
            });

            await Promise.all([longTermMemory, shortTermMemory]);

            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    },
    getLongTermMemory: async () => {
        try {
            const longTermMemories = await longTermMemoriesRepository.find();
            return { success: true, longTermMemories };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    },
    getShortTermMemory: async () => {
        try {
            const shortTermMemories = await shortTermMemoriesRepository.find();
            return { success: true, shortTermMemories };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }
}