import Battle from "../models/Battle.js";
import Question from "../models/question.js";
import { executeCode } from "../services/codeExecutor.js";
import {io} from "../../server.js"
export const runCode = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { code, language } = req.body;
if (!code || !language) {
  return res.status(400).json({ message: "Code and language required" });
}
    const battle = await Battle.findById(battleId);
    io.to(battleId.toString()).emit("userRunningCode", {
      userId: req.user,
    });
    if (!battle) return res.status(404).json({ message: "Battle not found" });
    if (battle.status !== "ongoing") {
      return res.status(400).json({ message: "Battle not active" });
    }
    // ✅ ADD: participant check
    if (
      !battle.creatorId.equals(req.user) &&
      !(battle.opponentId && battle.opponentId.equals(req.user))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ ADD: time check
    const now = new Date();
    const timeLimit = battle.extendedEndTime || battle.endTime;
    if (now > timeLimit) {
      return res.status(400).json({ message: "Battle time over" });
    }

    const question = await Question.findById(battle.questionId);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const publicTests = question.testCases.public;
    const testResults = [];

    for (const test of publicTests) {
      const result = await executeCode({ language, code, input: test.input });
      function normalize(output) {
        try {
          return JSON.stringify(JSON.parse(output));
        } catch {
          return output.trim().replace(/\s+/g, "");
        }
      }
      const passed =
        result.success && normalize(result.output) === normalize(test.output);
        // result.success && result.output?.trim() === test.output.trim();
      testResults.push({
        input: test.input,
        expected: test.output,
        actual: result.output,
        passed,
      });
    }

    const passedCount = testResults.filter((t) => t.passed).length;

    res.json({
      summary: `${passedCount}/${publicTests.length} test cases passed`,
      passedCount,
      totalCount: publicTests.length,
      testResults,
    });
  } catch (error) {
    res.status(500).json({ message: "Run failed" });
  }
};
