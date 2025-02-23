import {Router}          from "express";
import {MemoriesController} from "../controllers/memories.controller";

const router = Router();

router.post("/", MemoriesController.processAction);
router.get("/get-long-term-memory", MemoriesController.getLongTermMemory);
router.get("/get-short-term-memory", MemoriesController.getShortTermMemory);

export default router;