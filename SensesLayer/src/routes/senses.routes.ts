import {Router}          from "express";
import {SensesController} from "../controllers/senses.controller";
import imageUpload        from "../middlewares/fileHandlers";

const router = Router();

router.post("/", imageUpload, SensesController.seeAndProcess);

export default router;