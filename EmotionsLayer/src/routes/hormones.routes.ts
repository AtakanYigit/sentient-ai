import {Router}          from "express";
import {HormonesController} from "../controllers/hormones.controller";

const router = Router();

router.get("/", HormonesController.getHormones);
router.post("/", HormonesController.releaseHormones);

export default router;