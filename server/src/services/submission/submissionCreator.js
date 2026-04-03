import Submission from "../../models/Submission.js";
import Question from "../../models/question.js";
import { executeCode } from "../codeExecutor.js";

export const createAndEvaluate = async ({
  battleId,
  userId,
  code,
  language,
  now,
  questionId,
}) => {
  const existing = await Submission.findOne({ battleId, userId });
  if (existing) {
    return {
      error: 400,
      message: "You have already submitted code for this battle",
    };
  }

  const submission = await Submission.create({
    battleId,
    userId,
    code,
    language,
    isCorrect: false,
    submittedAt: now,
  });

  const question = await Question.findById(questionId);

  if (!question) return { error: 404, message: "Question not found" };

  const hiddenTests = question.testCases.hidden;
  if (!hiddenTests?.length)
    return { error: 400, message: "No test cases available" };

  let allPassed = true;
  let totalRuntime = 0;
  let totalMemory = 0;
  const testResults = [];

  for (const test of hiddenTests) {
    const result = await executeCode({ language, code, input: test.input });

    if (!result.success) {
      allPassed = false;
      break;
    }

    totalRuntime += result.runtime || 0;
    totalMemory += result.memory || 0;
const normalize = (s) => s.trim().replace(/\s+/g, "");
    const passed = normalize(result.output) === normalize(test.output);

    testResults.push({
      input: test.input,
      expected: test.output,
      actual: result.output,
      passed,
    });

    if (!passed) {
      allPassed = false;
      break;
    }
  }

  submission.isCorrect = allPassed;
  submission.runtimeMs = totalRuntime;
  submission.memoryUsedKb = totalMemory;
  await submission.save();

  return { submission, isCorrect: allPassed, testResults };
};
