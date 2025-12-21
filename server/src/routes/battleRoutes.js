import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createBattle } from "../controllers/battleController.js";
import { joinBattle } from "../controllers/joinBattle.js";

const router = express.Router();

router.post("/create", protect, createBattle);
router.post("/join/:battleId", protect, joinBattle);

export default router;
