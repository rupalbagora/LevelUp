import Battle from "../models/Battle.js";
import Submission from "../models/Submission.js";
import Question from "../models/question.js";
import { completeBattle } from "../services/battleServices.js";

export const submitCode = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { code } = req.body;
    const userId = req.user;

    // 1️⃣ Find battle
    const battle = await Battle.findById(battleId);

    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    if (battle.status === "completed") {
      return res.status(400).json({
        message: "Battle already completed",
      });
    }

    // 2️⃣ Check user is part of the battle
    if (
      battle.creatorId.toString() !== userId &&
      battle.opponentId.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "You are not part of this battle" });
    }

    const now = new Date();

    // 3️⃣ Check time validity
    if (battle.extendedEndTime) {
      if (now > battle.extendedEndTime) {
        return res.status(400).json({ message: "Battle time over" });
      }
    } else {
      if (now > battle.endTime) {
        return res.status(400).json({ message: "Battle time over" });
      }
    }

    // 4️⃣ Save submission
    const submission = await Submission.create({
      battleId,
      userId,
      code,
      isCorrect: false, // will be updated after evaluation
      submittedAt: now,
    });

    // 5️⃣ First submission triggers 2-minute extension
    if (!battle.firstSubmissionTime) {
      battle.firstSubmissionTime = now;
      battle.extendedEndTime = new Date(now.getTime() + 2 * 60 * 1000);
    }

    await battle.save();
    // 6️⃣ Fetch question for this battle
    const question = await Question.findById(battle.questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const hiddenTests = question.testCases.hidden;

    // TEMP: assume correct if hidden tests exist
    const isCorrect = hiddenTests && hiddenTests.length > 0;

    // update submission
    submission.isCorrect = isCorrect;
    await submission.save();

    // 7️⃣ Check if battle should be completed
    const submissionsCount = await Submission.countDocuments({ battleId });

    // If both players have submitted at least once
    if (submissionsCount >= 2) {
      await completeBattle(battleId);
    }

    // 6️⃣ Send response
    // res.status(201).json({
    //   message: "Code submitted successfully",
    //   submissionId: submission._id,
    //   extendedEndTime: battle.extendedEndTime,
    // });
    res.status(201).json({
      message: isCorrect ? "Accepted" : "Wrong Answer",
      submissionId: submission._id,
      isCorrect,
      extendedEndTime: battle.extendedEndTime,
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Code submission failed" });
  }
};
