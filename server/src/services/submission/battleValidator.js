import Battle from "../../models/Battle.js";

export const validateBattle = async (battleId, userId, code, language, res) => {
  console.log(res)
  const battle = await Battle.findById(battleId);

  if (!battle) {
    res.status(404).json({ message: "Battle not found" });
    return null;
  }
  if (!code || !language) {
    res.status(400).json({ message: "Code and language required" });
    return null;
  }
  if (battle.status !== "ongoing") {
    res.status(400).json({ message: "Battle is not active" });
    return null;
  }
  if (
    !battle.creatorId.equals(userId) &&
    !(battle.opponentId && battle.opponentId.equals(userId))
  ) {
    res.status(403).json({ message: "You are not part of this battle" });
    return null;
  }

  const now = new Date();
  const timeLimit = battle.extendedEndTime || battle.endTime;
  if (now > timeLimit) {
    res.status(400).json({ message: "Battle time over" });
    return null;
  }

  return { battle, now };
};
