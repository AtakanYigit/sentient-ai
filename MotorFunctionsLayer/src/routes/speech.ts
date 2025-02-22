import {Router}          from "express";
import {SpeechController} from "../controllers/speech.controller";

const router = Router();

router.post("/", SpeechController.speak);

export default router;