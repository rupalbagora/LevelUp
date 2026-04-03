  import Battle from "../models/Battle.js";
  import Submission from "../models/Submission.js";
  import { updateLeaderboardAfterBattle } from "./leaderboardServices.js";
import { io } from "../../server.js"; // top of file
  export const completeBattle = async (battleId) => {
    const battle = await Battle.findById(battleId);

    if (!battle.opponentId) {
      // Battle never started — no scoring, just mark completed
      battle.status = "completed";
      battle.completedAt = new Date();
      await battle.save();
      io.to(battleId.toString()).emit("battleEnded", {
        battleId,
        winnerId: null,
      });
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

   if (submissions.length === 1) {
     winnerId = submissions[0].userId;
   } else if (submissions.length === 2) {
     const [a, b] = submissions;

     if (a.runtimeMs < b.runtimeMs) {
       winnerId = a.userId;
     } else if (b.runtimeMs < a.runtimeMs) {
       winnerId = b.userId;
     } else if (a.memoryUsedKb < b.memoryUsedKb) {
       winnerId = a.userId;
     } else {
       winnerId = b.userId;
     }
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
