import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createBattle } from "../controllers/battleController.js";
import { joinBattle,getBattleQuestion } from "../controllers/joinBattle.js";
import { submitCode } from "../controllers/submission.js";
const router = express.Router();

router.post("/create", protect, createBattle);
router.post("/join/:battleId", protect, joinBattle);
router.get("/:battleId/question", protect, getBattleQuestion);
router.post("/:battleId/submit",protect,submitCode)
export default router;
