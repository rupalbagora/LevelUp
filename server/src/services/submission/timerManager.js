import Battle from "../../models/Battle.js";
import { completeBattle } from "../battleServices.js";
import { io } from "../../../server.js";

export const handleTimers = async (battle, battleId) => {
  // First submission → grant 2-minute extension
  if (!battle.firstSubmissionTime) {
    const now = new Date();
    battle.firstSubmissionTime = now;
    battle.extendedEndTime = new Date(now.getTime() + 2 * 60 * 1000);
    await battle.save();

    io.to(battleId.toString()).emit("extraTime", {
      extendedEndTime: battle.extendedEndTime,
    });
  }

  // Compute remaining time AFTER potential extension update
  const timeLimit = battle.extendedEndTime
    ? new Date(battle.extendedEndTime).getTime()
    : new Date(battle.endTime).getTime();
  const remainingTime = timeLimit - Date.now();

  // Schedule auto-complete — only once per battle
  if (!battle.timeoutScheduled && remainingTime > 5000) {
    battle.timeoutScheduled = true;
    await battle.save();

    setTimeout(async () => {
      try {
        const latest = await Battle.findById(battleId);
        if (latest && latest.status !== "completed") {
          await completeBattle(battleId);
          console.log("⏱️ Battle auto-completed due to timeout");
        }
      } catch (err) {
        console.error("Timeout error:", err);
      }
    }, remainingTime);
  }

  return battle; // return updated battle so controller has fresh extendedEndTime
};
