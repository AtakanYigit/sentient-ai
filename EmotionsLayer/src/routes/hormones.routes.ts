import {Router}          from "express";
import {HormonesController} from "../controllers/hormones.controller";

const router = Router();

router.get("/", HormonesController.getHormones);
router.put("/", HormonesController.updateHormones);

export default router;