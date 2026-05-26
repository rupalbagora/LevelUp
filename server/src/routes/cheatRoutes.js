import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { reportCheat } from "../controllers/cheatController.js";

const router = express.Router();

router.post("/:battleId/report-cheat", protect, reportCheat);

export default router;
