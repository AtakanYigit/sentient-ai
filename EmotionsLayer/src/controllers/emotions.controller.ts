import {Request, Response} from "express";
import {EmotionsService} from "../services/emotions.service";

export const EmotionsController = {
    getEmotions: async (req: Request, res: Response) => {
        try {
            const result = await EmotionsService.getEmotions();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching emotions"});
        }
    },
    getEmotionByName: async (req: Request, res: Response) => {
        try {
            const result = await EmotionsService.getEmotionByName(req.params.name);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching emotion by name"});
        }
    },
    updateEmotions: async (req: Request, res: Response) => {
        try {
            const result = await EmotionsService.updateEmotions(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error updating emotions"});
        }
    }
}