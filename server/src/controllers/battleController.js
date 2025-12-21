import Battle from "../models/Battle.js";

export const createBattle = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    const battle = await Battle.create({
      topic,
      difficulty,
      creatorId: req.user,
    });

    res.status(201).json({
      message: "Battle created",
      battleId: battle._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Battle creation failed" });
  }
};
