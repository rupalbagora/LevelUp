import { io } from "../../server.js";
import { validateBattle } from "../services/submission/battleValidator.js";
import { createAndEvaluate } from "../services/submission/submissionCreator.js";
import { handleTimers } from "../services/submission/timerManager.js";
import { checkCompletion } from "../services/submission/completionChecker.js";

export const submitCode = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { code, language } = req.body;
    const userId = req.user;

    // 1. Validate
    const validated = await validateBattle(
      battleId,
      userId,
      code,
      language,
      res,
    );
    if (!validated) return;
    let { battle, now } = validated;

    // 2. Timers (extension + auto-complete scheduling)
    battle = await handleTimers(battle, battleId);

    // 3. Create submission & run hidden tests
    const result = await createAndEvaluate({
      battleId,
      userId,
      code,
      language,
      now,
      questionId: battle.questionId,
    });

    if (result.error) {
      return res.status(result.error).json({ message: result.message });
    }

    const { submission, isCorrect, testResults } = result;

    // 4. Real-time update
    io.to(battleId.toString()).emit("submissionUpdate", { userId, isCorrect });

    if (isCorrect) {
      io.to(battleId.toString()).emit("correctSubmission", {
        userId,
      });
    }

    // 5. Check if battle should end
    await checkCompletion(battleId, battle);

    // 6. Respond
    return res.status(201).json({
      message: isCorrect ? "Accepted" : "Wrong Answer",
      submissionId: submission._id,
      isCorrect,
      testResults,
      extendedEndTime: battle.extendedEndTime,
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Code submission failed" });
  }
};