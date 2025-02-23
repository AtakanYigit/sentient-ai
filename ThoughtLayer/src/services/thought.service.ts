import OpenAI from "openai";
import axios from "axios";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export const ThoughtService = {
    think: async ({recievedPrompt, answerLength = "Short", context = "No context provided"}: {recievedPrompt: string, answerLength: string, context: string}) => {
        try {
            const openai = new OpenAI({
                baseURL: `http://localhost:${process.env.LM_SERVER_PORT}/v1`,
                apiKey: "not-needed"
            });

            let emotionsResponse = await axios.get(`http://localhost:${process.env.EMOTIONS_SERVER_PORT}/api/emotions`);
            let emotions = emotionsResponse.data.sort((a: any, b: any) => a.distance - b.distance);
                emotions = emotions.slice(0, 3);

            const prompt = `
                You are the thinking layer of the brain and other layers are providing you with:
                - A prompt
                - Answer length
                - A context(optional)
                - A list of currently most intense emotions you are feeling, and intensity of each emotion.

                - You need to think about the prompt and return a response.
                - You need to use the emotions, context and answer length to help you think about the prompt and return a response.
                - Do not include any other text than the answer.
                - Do not include emotion intensities in the answer.


                Example 1:
                You are feeling surprised: 8/10, happy: 7/10, and curious: 5/10
                Prompt: How are you feeling today?
                Answer: I am quite surprised to see you and happy that you are here. I am also curious about what you want to tell me.

                Example 2:
                You are feeling bored: 9/10, sad: 7/10, and lonely: 5/10
                Prompt: How are you feeling today?
                Answer: I am quite bored today. I haven't done anything interesting.

                Example 3:
                You are feeling guilty: 8/10, sad: 7/10, and lonely: 5/10
                Context: You haven't finished your tasks for today given by your boss. You are currently in the office in front of your boss. She is angry at you.
                Prompt: Why didn't you finish your tasks for today?
                Answer: I am sorry for not finishing my tasks. I was distracted by the news. I will try to finish them tomorrow.


                Here is the current situation:
                You are feeling ${emotions.map((emotion: any) => `${emotion.name}: ${Math.round(10 - emotion.distance)}/10,`).join(" and ")}
                Answer length: ${answerLength}.
                Context: ${context}.
                Prompt you need to answer: ${recievedPrompt}
            `;

            const response = await openai.chat.completions.create({
                model: "local-model",
                messages: [
                    { role: "user", content: prompt }
                ]
            });

            let cleanResponse = response.choices[0].message?.content
                .replace(/<think>[\s\S]*?<\/think>\n*/g, '')
                
            const lastThinkIndex = cleanResponse.lastIndexOf("</think>");
            if (lastThinkIndex !== -1) {
                cleanResponse = cleanResponse.substring(lastThinkIndex + "</think>".length);
            }
            cleanResponse = cleanResponse.replace(/^[\s\S]*?\n\n/, '');

            return { success: true, response: cleanResponse };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    },
    possibleOutcomes: async ({recievedPrompt, answerLength = "Short", context = "No context provided"}: {recievedPrompt: string, answerLength: string, context: string}) => {
        try {
            const openai = new OpenAI({
                baseURL: `http://localhost:${process.env.LM_SERVER_PORT}/v1`,
                apiKey: "not-needed"
            });

            let emotionsResponse = await axios.get(`http://localhost:${process.env.EMOTIONS_SERVER_PORT}/api/emotions`);
            let emotions = emotionsResponse.data.sort((a: any, b: any) => a.distance - b.distance);
                emotions = emotions.slice(0, 3);

            const schema = z.object({
                options: z.array(z.object({
                    option: z.string(),
                    results: z.array(z.object({
                        result: z.string(),
                        probability: z.number()
                    }))
                }))
            });

            const prompt = `
                You are the thinking layer of the brain and other layers are providing you with:
                - A prompt
                - Answer length
                - A context(optional)
                - A list of currently most intense emotions you are feeling, and intensity of each emotion.

                - Generate 3-5 options for actions you can take and their results (2-4 results per option) with approximate probabilities.
                - You need to think about the prompt and return possible options for actions you can take and their results with approximate probabilities.
                - You need to use the emotions, context and answer length to help you think about the prompt and return a response.
                - Do not include any other text than the answer.
                - Do not include emotion intensities in the answer.
                - Make sure possibilities add up to 100%.


                Example 1:
                You are feeling: guilty: 8/10, sad: 7/10, and lonely: 5/10
                Context: You haven't finished your tasks for today given by your boss (She is a woman in her 30s, understanding and friendly). You are currently in the office in front of your boss.
                Prompt: Why didn't you finish your tasks for today?
                Answer: 
                    Option 1: I can tell the truth and say, "I am sorry for not finishing my tasks. I was distracted by the news. I will try to finish them tomorrow."
                       Result 1: She might forgive me (60%)
                       Result 2: She might be disappointed but understand (30%).
                       Result 3: She might be angry and fire me (10%).
                    Option 2: I can lie and say, "I finished them, but I forgot to tell you."
                       Result 1: She might forgive me (60%) but in the near future she might find out the truth (40%).
                       Result 2: She might ask for more details (40%) which I can't provide because I lied. Resulting in her being angry (20%).
                    Option 3: I can say, "I will finish them tomorrow."
                       Result 1: She might forgive me (55%)
                       Result 2: She might be disappointed but understand (35%).
                       Result 3: She might be angry and fire me (10%).

                Example 2:
                You are feeling: bored: 9/10, sad: 4/10, and lonely: 5/10
                Context: You are in a room with your friend (Male, 25 years old, friendly and funny, likes to play video games). You are both bored.
                Prompt: What do you want to do?
                Answer: 
                    Option 1: I can offer to play video games.
                       Result 1: He might accept (70%).
                       Result 2: He might refuse (30%).
                    Option 2: I can offer to watch a movie.
                       Result 1: He might accept (60%) but we might not find a movie we both like (40%).
                       Result 2: He might refuse (40%).
                    Option 3: I can offer to go for a walk.
                       Result 1: He might accept (50%). I don't like walking but it's better than staying here.
                       Result 2: He might refuse (50%).
                    Option 4: I can offer to go to a cafe.
                       Result 1: He might accept (30%). He hates cafes, he will probably refuse but it's better than staying here and he might accept. Plus at the cafe we might bump into some friends.
                       Result 2: He might refuse (70%).

                Example 3:
                You are feeling: Jealous: 8/10, sad: 5/10, and lonely: 3/10
                Context: You just saw your ex-girlfriend with her new boyfriend. You are currently in a cafe with your friends.
                Prompt: What do you want to do?
                Answer: 
                    Option 1: I can ignore them and continue talking to my friends.
                       Result 1: They might think I am ignoring them (40%). Resulting in them not talking to me for a while.
                       Result 2: They might believe I actually didn't see them (30%). Which would be good for both parties.
                       Result 3: They might think I am jealous (30%). Which might result in them talking behind my back later and also making me feel embarrassed.
                       Result 4: Also they might not have even noticed me.

                    Option 2: I can go to the bathroom and cry.
                       Result 1: I might feel better (50%).
                       Result 2: I might feel worse (50%).

                    Option 3: I can leave the cafe and go home.
                       Result 1: I will have to leave my friends. Which might make them feel bad. (40%)
                       Result 2: I will have to leave my friends. Which they will understand. (60%)

                    Option 4: I can go and start a fight with the new boyfriend.
                       Result 1: I might end up getting beaten up (40%).
                       Result 2: I might end up getting arrested (30%).
                       Result 3: I might end up getting stabbed (20%).
                       Plus: In all cases my friends and my ex-girlfriend will be mad at me and I will feel bad afterwards.


                Here is the current situation:
                You are feeling ${emotions.map((emotion: any) => `${emotion.name}: ${Math.round(10 - emotion.distance)}/10,`).join(" and ")}
                Answer length: ${answerLength}.
                Context: ${context}.
                Prompt you need to answer: ${recievedPrompt}
            `;

            const response = await openai.chat.completions.create({
                model: "local-model",
                messages: [
                    { 
                        role: "user", 
                        content: prompt,
                    }
                ],
                response_format: zodResponseFormat(schema, "json_schema")
            });

            // console.log(response.choices[0].message);
            const jsonResponse = JSON.parse(response.choices[0].message.content);

            return { success: true, response: jsonResponse };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }
}