import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getLeaderboard,
  getTopLeaderboard,
  getMyRank,
} from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/", getLeaderboard);
router.get("/top/:limit", getTopLeaderboard);
router.get("/me", protect, getMyRank);

export default router;
