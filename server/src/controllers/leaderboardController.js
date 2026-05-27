import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";

/**
 * GET /api/leaderboard
 * Full leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .sort({ rankPosition: 1 })
      .populate("userId", "username totalWins totalBattles");
    console.log("leaderboard", leaderboard);
    const result = leaderboard.map((entry) => ({
      rankPosition: entry.rankPosition,
      username: entry.userId.username,
      score: entry.score,
      totalWins: entry.userId.totalWins,
      totalBattles: entry.userId.totalBattles,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

/**
 * GET /api/leaderboard/top/:limit
 */
export const getTopLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;

    const leaderboard = await Leaderboard.find()
      .sort({ rankPosition: 1 })
      .limit(limit)
      .populate("userId", "username totalWins totalBattles");

    const result = leaderboard.map((entry) => ({
      rankPosition: entry.rankPosition,
      username: entry.userId.username,
      score: entry.score,
      totalWins: entry.userId.totalWins,
      totalBattles: entry.userId.totalBattles,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top leaderboard" });
  }
};

/**
 * GET /api/leaderboard/me
 */
export const getMyRank = async (req, res) => {
  try {
    const userId = req.user;

    const entry = await Leaderboard.findOne({ userId });

    if (!entry) {
      return res.status(404).json({ message: "Leaderboard entry not found" });
    }

    const user = await User.findById(userId);

    res.json({
      rankPosition: entry.rankPosition,
      score: entry.score,
      totalWins: user.totalWins,
      totalBattles: user.totalBattles,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user rank" });
  }
};
