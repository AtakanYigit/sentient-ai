import OpenAI                   from "openai";
import {GoogleGenerativeAI}     from "@google/generative-ai";
import axios                    from "axios";
import {z}                      from "zod";
import {zodResponseFormat}      from "openai/helpers/zod";
import {DB}                     from "../config/database";
import sendActionToMemoryLayer  from "../utils/sendActionTomemoryLayer";
import {PastVisions}            from "../entities/PastVisions";
// import {Context}               from "../entities/Context";

require("dotenv").config({ path: '../.env' });

// const contextRepository = DB.getRepository(Context);
const pastVisionsRepository = DB.getRepository(PastVisions);

const openai = new OpenAI({
    baseURL: `http://localhost:${process.env.LM_SERVER_PORT}/v1`,
    apiKey: "not-needed"
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

export const SensesService = {
    seeAndProcess: async (file: Express.Multer.File) => {
        try {
            const base64Image = file.buffer.toString("base64");
            
            const pastVision = await pastVisionsRepository.findOne({
                where: { createdAt: new Date(Date.now() - 60000) },
                order: { createdAt: "DESC" },
            });
    

            const prompt = `
                You are the visual understanding layer of the brain and your job is to understand the image you are getting from your eyes.
                - An image representing the vision your are getting from your eyes.
                - A context(optional)

                There are some rules you must follow:
                - You must describe the image in detail.
                - Image comes from your eyes, so you must describe it in the way a human would see it.
                - You are not allowed to mention stuff like, "I see camera buttons", "this might be a camera", "this might be a phone", etc.
                - You are given the last vision you had, this is given to you as a reference. Do not mention it in your response. Do not compare it with the new image. It is only for you to have a context of what you saw before. It is not part of the new image.

                Last vision text: 
                ${pastVision?.vision}.


                Here is the image, describe what you see in detail.
            `;
                // Context: ${context?.context}.
            
            let vision;
            try {
                const result = await openai.chat.completions.create({
                    model: "local-model",
                    messages: [{ 
                        role: "user", 
                        content: [
                            {
                                type: "text",
                                text: prompt
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }],
                    response_format: zodResponseFormat(z.string(), "json_schema")
                });

                vision = result.choices[0].message.content;
            }catch(error){
                const result = await model.generateContent([
                    {
                        inlineData:{
                            data: base64Image,
                            mimeType: "image/jpeg"
                        }
                    },
                    prompt
                ]);
                vision = result.response.text();
            }

            sendActionToMemoryLayer(`I saw: ${vision}`);

            const newVision = new PastVisions();
            newVision.vision = vision;
            await pastVisionsRepository.save(newVision);

            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    },
}