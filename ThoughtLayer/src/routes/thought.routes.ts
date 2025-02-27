import {Router}          from "express";
import {ThoughtController} from "../controllers/thought.controller";

const router = Router();

router.post("/", ThoughtController.think);
router.post("/possible-actions-and-outcomes", ThoughtController.possibleActionsAndOutcomes);

export default router;