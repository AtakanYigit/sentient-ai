import {Request, Response} from "express";
import {HormonesService}   from "../services/hormones.service";

export const HormonesController = {
    getHormones: async (req: Request, res: Response) => {
        try {
            const result = await HormonesService.getHormones();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching hormones"});
        }
    },
    releaseHormones: async (req: Request, res: Response) => {
        try {
            const result = await HormonesService.releaseHormones(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error updating hormones"});
        }
    }
}