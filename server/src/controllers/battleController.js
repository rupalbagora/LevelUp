import Battle from "../models/Battle.js";

export const createBattle = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
if (!topic || !difficulty) {
  return res.status(400).json({ message: "Topic and difficulty required" });
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
