import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createBattle, terminateBattle, acceptBattle} from "../controllers/battleController.js";
import { joinBattle,getBattleQuestion } from "../controllers/joinBattle.js";
import { submitCode } from "../controllers/submission.js";
import { runCode } from "../controllers/runCodeController.js";
import { getAIHint } from "../controllers/hintController.js";
const router = express.Router();

router.post("/create", protect, createBattle);
router.post("/join/:battleId", protect, joinBattle);
router.post("/accept/:battleId", protect, acceptBattle); // <-- Ye naya route add karein
router.post("/terminate/:battleId", protect, terminateBattle); // Ye terminateBattle function.
router.get("/:battleId/question", protect, getBattleQuestion);
router.post("/:battleId/submit",protect,submitCode);
router.post("/:battleId/run", protect, runCode);
router.post("/get-hint", protect, getAIHint);
export default router;
 
