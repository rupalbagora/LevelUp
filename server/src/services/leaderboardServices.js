import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";
import Battle from "../models/Battle.js";
import { recordDailyActivity } from "./activityService.js";

let ioRef = null;

export const setLeaderboardSocket = (io) => {
  ioRef = io;
};

const formatLeaderboardEntry = (entry, fallbackRank) => ({
  rankPosition: entry.rankPosition || fallbackRank,
  username: entry.userId?.username || "Unknown Player",
  score: entry.score || 0,
  totalWins: entry.userId?.totalWins || 0,
  totalBattles: entry.userId?.totalBattles || 0,
});

export const fetchLeaderboardSnapshot = async () => {
  const leaderboard = await Leaderboard.find()
    .sort({ rankPosition: 1, score: -1, lastUpdated: 1 })
    .populate("userId", "username totalWins totalBattles");

  return leaderboard.map((entry, index) =>
    formatLeaderboardEntry(entry, index + 1),
  );
};

const emitLeaderboardUpdate = async () => {
  if (!ioRef) return;

  try {
    const leaderboard = await fetchLeaderboardSnapshot();
    ioRef.emit("leaderboard:updated", {
      leaderboard,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("emitLeaderboardUpdate:", error.message);
  }
};

/* ------------------ HELPERS ------------------ */

const updateLeaderboardEntry = async (
  userId,
  winnerId,
  winnerScore,
  loserScore,
) => {
  if (!userId) return;

  const scoreToAdd =
    winnerId === null
      ? winnerScore
      : userId.toString() === winnerId.toString()
        ? winnerScore
        : loserScore;

  const entry = await Leaderboard.findOne({ userId });

  if (entry) {
    entry.score += scoreToAdd;
    entry.lastUpdated = new Date();
    await entry.save();
  } else {
    await Leaderboard.create({
      userId,
      score: scoreToAdd,
    });
  }
};

const recalculateRanks = async () => {
  const leaderboard = await Leaderboard.find().sort({
    score: -1,
    lastUpdated: 1,
  });

  for (let i = 0; i < leaderboard.length; i++) {
    leaderboard[i].rankPosition = i + 1;
    await leaderboard[i].save();
  }
};

/* ------------------ MAIN SERVICE ------------------ */

export const updateLeaderboardAfterBattle = async (battleId) => {
  const battle = await Battle.findById(battleId);

  if (!battle || battle.status !== "completed") return;

  const { winnerId, creatorId, opponentId } = battle;

  // Update total battles for both players
  await User.updateMany(
    { _id: { $in: [creatorId, opponentId].filter(Boolean) } },
    { $inc: { totalBattles: 1 } },
  );

  let winnerScore = 0;
  let loserScore = 0;

  if (winnerId) {
    winnerScore = 10;
    loserScore = 0;

    await User.findByIdAndUpdate(winnerId, {
      $inc: { totalWins: 1 },
    });
  } else {
    // Draw
    winnerScore = 5;
    loserScore = 5;
  }

  // Update leaderboard
  await updateLeaderboardEntry(creatorId, winnerId, winnerScore, loserScore);
  await updateLeaderboardEntry(opponentId, winnerId, winnerScore, loserScore);

  // Recalculate ranks
  await recalculateRanks();

  // Daily activity for both players
  await recordDailyActivity(creatorId);
  await recordDailyActivity(opponentId);

  // Live leaderboard broadcast
  await emitLeaderboardUpdate();
};
