import Battle from "../models/Battle.js";
import Submission from "../models/Submission.js";
import { updateLeaderboardAfterBattle } from "./leaderboardServices.js";

export const completeBattle = async (battleId) => {
  const battle = await Battle.findById(battleId);

  if (!battle || battle.status === "completed") {
    return;
  }

  // Fetch submissions sorted by time
  const submissions = await Submission.find({ battleId }).sort({
    submittedAt: 1,
  });
console.log(submissions)
  let winnerId = null;

  if (submissions.length === 1) {
    // Only one player submitted
    winnerId = submissions[0].userId;
  } else if (submissions.length >= 2) {
    // Earliest submission wins
    winnerId = submissions[0].userId;
  }

  battle.status = "completed";
  battle.winnerId = winnerId;
  battle.completedAt = new Date();

  await battle.save();
  await updateLeaderboardAfterBattle(battleId);

};
