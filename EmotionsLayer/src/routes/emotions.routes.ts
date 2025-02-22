import {Router}          from "express";
import {EmotionsController} from "../controllers/emotions.controller";

const router = Router();

router.get("/", EmotionsController.getEmotions);
router.get("/:name", EmotionsController.getEmotionByName);
router.put("/", EmotionsController.updateEmotions);

export default router;