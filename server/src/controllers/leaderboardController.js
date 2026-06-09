import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";

const formatLeaderboardEntry = (entry, fallbackRank) => ({
  rankPosition: entry.rankPosition || fallbackRank,
  username: entry.userId?.username || "Unknown Player",
  score: entry.score || 0,
  totalWins: entry.userId?.totalWins || 0,
  totalBattles: entry.userId?.totalBattles || 0,
});

/**
 * GET /api/leaderboard
 * Full leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .sort({ rankPosition: 1, score: -1, lastUpdated: 1 })
      .populate("userId", "username totalWins totalBattles");

    const result = leaderboard.map((entry, index) =>
      formatLeaderboardEntry(entry, index + 1),
    );

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
      .sort({ rankPosition: 1, score: -1, lastUpdated: 1 })
      .limit(limit)
      .populate("userId", "username totalWins totalBattles");

    const result = leaderboard.map((entry, index) =>
      formatLeaderboardEntry(entry, index + 1),
    );

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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!entry) {
      return res.json({
        rankPosition: null,
        score: 0,
        totalWins: user.totalWins || 0,
        totalBattles: user.totalBattles || 0,
      });
    }

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
