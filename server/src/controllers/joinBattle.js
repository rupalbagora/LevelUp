import Battle from "../models/Battle.js";
export const joinBattle = async (req, res) => {
  try {
    const { battleId } = req.params;

    const battle = await Battle.findById(battleId);

    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    if (battle.status !== "waiting") {
      return res.status(400).json({ message: "Battle already started" });
    }

    if (battle.creatorId.toString() === req.user) {
      return res.status(400).json({ message: "Cannot join your own battle" });
    }

    battle.opponentId = req.user;
    battle.status = "ongoing";
    battle.startTime = new Date();

    await battle.save();

    res.json({ message: "Joined battle successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to join battle" , error});
    
  }
};
