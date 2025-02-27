import {Request, Response} from "express";
import {SensesService}   from "../services/senses.service";

export const SensesController = {
    seeAndProcess: async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.Multer.File;
            const result = await SensesService.seeAndProcess(file);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({message: "Error fetching thought"});
        }
    },
}