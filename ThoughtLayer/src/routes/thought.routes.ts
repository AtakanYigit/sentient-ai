import {Router}          from "express";
import {ThoughtController} from "../controllers/thought.controller";

const router = Router();

router.post("/", ThoughtController.think);
router.post("/possible-outcomes", ThoughtController.possibleOutcomes);

export default router;