import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createBattle } from "../controllers/battleController.js";
import { joinBattle,getBattleQuestion } from "../controllers/joinBattle.js";
import { submitCode } from "../controllers/submission.js";
import { runCode } from "../controllers/runCodeController.js";
import { getAIHint } from "../controllers/hintController.js";
const router = express.Router();

router.post("/create", protect, createBattle);
router.post("/join/:battleId", protect, joinBattle);
router.get("/:battleId/question", protect, getBattleQuestion);
router.post("/:battleId/submit",protect,submitCode);
router.post("/:battleId/run", protect, runCode);
router.post("/:battleId/hint", protect, getAIHint);
export default router;

 