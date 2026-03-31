  import Battle from "../models/Battle.js";
  import Submission from "../models/Submission.js";
  import { updateLeaderboardAfterBattle } from "./leaderboardServices.js";
import { io } from "../../server.js"; // top of file
  export const completeBattle = async (battleId) => {
    const battle = await Battle.findById(battleId);

    if (!battle || battle.status === "completed") {
      return;
    }

    // Fetch submissions sorted by time
    const submissions = await Submission.find({
      battleId,
      isCorrect: true,
    }).sort({
      submittedAt: 1,
    });
    console.log(submissions);
    let winnerId = null;

    if (submissions.length >= 1) {
      winnerId = submissions[0].userId;
    }

    battle.status = "completed";
    battle.winnerId = winnerId;
    battle.completedAt = new Date();

    await battle.save();
    // 🔥 REAL-TIME: battle ended
    io.to(battleId.toString()).emit("battleEnded", {
      battleId,
      winnerId: battle.winnerId,
    });
    await updateLeaderboardAfterBattle(battleId);
  };;
