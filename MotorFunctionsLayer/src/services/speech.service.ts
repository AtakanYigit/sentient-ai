// import {DB} from "../config/database";

import { ElevenLabsClient, play, stream } from "elevenlabs";

require("dotenv").config({ path: '../.env' });

// const speechRepository = DB.getRepository(Speech);

export const SpeechService = {
    speak: async (text: string, emotion: string = "natural") => {
        try {
            const elevenlabs = new ElevenLabsClient({
                apiKey: process.env.ELEVENLABS_API_KEY,
            });

            // For break <break time="1s" /> or ----

            const fierceVoice  = "Emmaline - young British girl";
            const whisperVoice = "Alice - ASMR British Whisper";
            const naturalVoice = "Lily";

            console.log(emotion);

            let voice: string;
            if (emotion === "fierce") {
                voice = fierceVoice;
            } else if (emotion === "whisper") {
                voice = whisperVoice;
            } else {
                voice = naturalVoice;
            }

            const audio = await elevenlabs.generate({
                // model_id: "eleven_flash_v2_5",
                voice: voice,
                text: text,
            });

            await play(audio);

            return {success: true};
        } catch (error) {
            console.log(error);
            return {success: false};
        }
    }
}