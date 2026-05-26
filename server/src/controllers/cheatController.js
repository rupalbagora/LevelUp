import Battle from "../models/Battle.js";
import BlackCard from "../models/BlackCard.js";
import { updateLeaderboardAfterBattle } from "../services/leaderboardServices.js";
import { io } from "../../server.js";

const BAN_DURATION_MS = 48 * 60 * 60 * 1000;

export const findActiveBlackCard = async (userId) => {
  const now = new Date();

  const activeCard = await BlackCard.findOne({
    userId,
    status: "active",
    expiresAt: { $gt: now },
  }).sort({ expiresAt: -1 });

  if (!activeCard) {
    await BlackCard.updateMany(
      { userId, status: "active", expiresAt: { $lte: now } },
      { status: "expired" },
    );
  }

  return activeCard;
};

export const getBanStatus = async (req, res) => {
  try {
    const activeBlackCard = await findActiveBlackCard(req.user);

    if (!activeBlackCard) {
      return res.json({
        banned: false,
        message: "User is not banned",
      });
    }

    return res.json({
      banned: true,
      message: "You are banned for 48 hours due to cheating.",
      reason: activeBlackCard.reason,
      bannedUntil: activeBlackCard.expiresAt,
      serverTime: new Date(),
    });
  } catch (error) {
    console.error("Ban status error:", error);
    return res.status(500).json({ message: "Failed to fetch ban status" });
  }
};

export const reportCheat = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { reason = "Unfair behavior detected" } = req.body;
    const userId = req.user;

    const battle = await Battle.findById(battleId);

    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    const isCreator = battle.creatorId?.toString() === userId.toString();
    const isOpponent = battle.opponentId?.toString() === userId.toString();

    if (!isCreator && !isOpponent) {
      return res.status(403).json({ message: "Only battle players can report cheating" });
    }

    const expiresAt = new Date(Date.now() + BAN_DURATION_MS);

    const blackCard = await BlackCard.create({
      userId,
      battleId,
      reason,
      expiresAt,
    });

    const winnerId = isCreator ? battle.opponentId : battle.creatorId;

    if (battle.status !== "completed") {
      battle.status = "completed";
      battle.winnerId = winnerId || null;
      battle.completedAt = new Date();
      await battle.save();

      io.to(battleId.toString()).emit("battleEnded", {
        battleId,
        winnerId: battle.winnerId,
        reason: "cheat_detected",
        bannedUserId: userId,
      });

      await updateLeaderboardAfterBattle(battleId);
    }

    return res.status(201).json({
      success: true,
      message: "Cheating detected. User banned for 48 hours.",
      blackCardId: blackCard._id,
      expiresAt,
      winnerId,
    });
  } catch (error) {
    console.error("Report cheat error:", error);
    return res.status(500).json({ message: "Failed to report cheating" });
    
  }
};
