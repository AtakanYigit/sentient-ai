import OpenAI from "openai";
import axios from "axios";

export const ThoughtService = {
    think: async ({recievedPrompt, answerLength = "Short", context = "No context provided"}: {recievedPrompt: string, answerLength: string, context: string}) => {
        try {
            // const testPrompt = "How are you feeling today?";
            
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
    }
}