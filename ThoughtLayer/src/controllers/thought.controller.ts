import {Request, Response} from "express";
import {ThoughtService}   from "../services/thought.service";

export const ThoughtController = {
    think: async (req: Request, res: Response) => {
        try {
            const recievedPrompt = req.body.prompt;
            const answerLength   = req.body.answerLength;
            const context        = req.body.context;
            const result = await ThoughtService.think({recievedPrompt, answerLength, context});
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching thought"});
        }
    },
}