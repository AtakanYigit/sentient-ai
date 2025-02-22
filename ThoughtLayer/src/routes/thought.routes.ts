import {Router}          from "express";
import {ThoughtController} from "../controllers/thought.controller";

const router = Router();

router.post("/", ThoughtController.think);

export default router;