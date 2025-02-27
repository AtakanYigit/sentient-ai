import {Request, Response} from "express";
import {SpeechService}   from "../services/speech.service";

export const SpeechController = {
    speak: async (req: Request, res: Response) => {
        try {
            const text = req?.body?.text;
            const tone = req?.body?.tone;
            const result = await SpeechService.speak(text, tone);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching speech"});
        }
    },
}