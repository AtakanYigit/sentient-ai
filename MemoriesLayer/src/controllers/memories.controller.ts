import {Request, Response} from "express";
import {MemoriesService}   from "../services/memories.service";

export const MemoriesController = {
    processAction: async (req: Request, res: Response) => {
        try {
            const action = req.body.action;
            const type = req.body.type;
            const result = await MemoriesService.processAction(action, type);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching thought"});
        }
    },
    getLongTermMemory: async (req: Request, res: Response) => {
        try {
            const result = await MemoriesService.getLongTermMemory();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching thought"});
        }
    },
    getShortTermMemory: async (req: Request, res: Response) => {
        try {
            const result = await MemoriesService.getShortTermMemory();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching thought"});
        }
    }
}