import Battle from "../models/Battle.js";
import { findActiveBlackCard } from "./cheatController.js";

export const createBattle = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
if (!topic || !difficulty) {
  return res.status(400).json({ message: "Topic and difficulty required" });
}

    const activeBlackCard = await findActiveBlackCard(req.user);
    if (activeBlackCard) {
      return res.status(403).json({
        message: "User is banned for cheating",
        bannedUntil: activeBlackCard.expiresAt,
      });
    }

    const battle = await Battle.create({
      topic,
      difficulty,
      creatorId: req.user,
    });

    res.status(201).json({
      message: "Battle created",
      battleId: battle._id,
    });
    console.log("Created battle:", battle._id);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Battle creation failed" });
  }
};
