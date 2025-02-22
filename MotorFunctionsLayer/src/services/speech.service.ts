// import {DB} from "../config/database";

import { ElevenLabsClient, play } from "elevenlabs";

// const speechRepository = DB.getRepository(Speech);

export const SpeechService = {
    speak: async (text: string) => {
        try {
            const elevenlabs = new ElevenLabsClient({
                apiKey: process.env.ELEVENLABS_API_KEY,
            });

            // For break <break time="1s" /> or ----
            //

            
            const testText = `"You're leaving?" \n <break time="1s" /> \n "That's it!!"`
            const audio = await elevenlabs.generate({
                model_id: "eleven_flash_v2_5",
                voice: "pFZP5JQG7iQjIQuC4Bku",
                text: testText,
                // text: text,
            });

            await play(audio);

            return {success: true};
        } catch (error) {
            console.log(error);
            return {success: false};
        }
    }
}