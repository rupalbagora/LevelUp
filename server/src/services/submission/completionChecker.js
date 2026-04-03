import Submission from "../../models/Submission.js";
import { completeBattle } from "../battleServices.js";

export const checkCompletion = async (battleId, battle) => {
  const [correctCount, totalCount] = await Promise.all([
    Submission.countDocuments({ battleId, isCorrect: true }),
    Submission.countDocuments({ battleId }),
  ]);

  const effectiveEndTime = battle.extendedEndTime || battle.endTime;
  const now = new Date();

  if (totalCount >= 2 || (correctCount >= 1 && now > effectiveEndTime)) {
    await completeBattle(battleId);
  }
};
