import Battle from "../models/Battle.js";
import Question from "../models/question.js";
import { io } from "../../server.js";
import { findActiveBlackCard } from "./cheatController.js";
export const joinBattle = async (req, res) => {
  try {
    const { battleId } = req.params;

    const activeBlackCard = await findActiveBlackCard(req.user);
    if (activeBlackCard) {
      return res.status(403).json({
        message: "User is banned for cheating",
        bannedUntil: activeBlackCard.expiresAt,
      });
    }

    const existingBattle = await Battle.findById(battleId);
    console.log(".....", existingBattle);
    if (!existingBattle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    if (existingBattle.status !== "waiting") {
      return res.status(400).json({ message: "Battle already started" });
    }

    console.log("Creator:", existingBattle.creatorId.toString());
    console.log("Current user:", req.user.toString());

    if (existingBattle.creatorId.equals(req.user)) {
      return res.status(400).json({ message: "Cannot join your own battle" });
    }

    const questions = await Question.find({
      topic: existingBattle.topic,
      difficulty: existingBattle.difficulty,
    });
    console.log("hey", questions);

    if (questions.length === 0) {
      return res.status(400).json({
        message: "No quations available for this topic and difficulty",
      });
    }

    //Pick random question
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];

    // const BATTLE_DURATION = 30 * 60 * 1000; // 30 minutes
    // battle.startTime = new Date();
    // battle.endTime = new Date(Date.now() + BATTLE_DURATION);

    //     // Assign question + opponent
    //     battle.opponentId = req.user;
    //     battle.questionId = selectedQuestion._id;
    //     battle.status = "ongoing";
    //     // battle.startTime = new Date();

    //     await battle.save();

    //     res.json({ message: "Joined battle successfully" ,
    //       questionId : selectedQuestion._id,
    //     });
    //   } catch (error) {
    //     res.status(500).json({ message: "Failed to join battle" , error});

    //   }
    // };
    // 4️⃣ Atomic update (race condition safe)
    const BATTLE_DURATION = 30 * 60 * 1000;

    const battle = await Battle.findOneAndUpdate(
      {
        _id: battleId,
        opponentId: null,
        status: "waiting",
      },
      {
        opponentId: req.user,
        questionId: selectedQuestion._id,
        status: "ongoing",
        startTime: new Date(),
        endTime: new Date(Date.now() + BATTLE_DURATION),
      },
      { new: true },
    );

    if (!battle) {
      return res.status(400).json({
        message: "Battle already joined by another user",
      });
    }

    // 🔥 REAL-TIME EVENT
  //  io.to(battleId.toString()).emit("battleStarted", {
  //    battleId,
  //    opponentId: req.user,
  //    startTime: battle.startTime,
  //    endTime: battle.endTime,
  //    questionId: battle.questionId,
  //  });

  //  io.to(battleId.toString()).emit("timerSync", {
  //    startTime: battle.startTime,
  //    endTime: battle.endTime,
  //  });

    res.json({
      message: "Joined battle successfully",
      questionId: selectedQuestion._id,
    });
  } catch (error) {
    console.error("Join battle error:", error);
    res.status(500).json({ message: "Failed to join battle" });
  }
};


export const getBattleQuestion = async (req, res) => {
  try {
    const { battleId } = req.params;
    console.log(battleId);
    const battle = await Battle.findById(battleId).populate("questionId");

    if (!battle || !battle.questionId) {
      return res.status(404).json({ message: "Question not assigned yet" });
    }

    // Only participants allowed
    if (
      // battle.creatorId.toString() !== req.user &&
      // battle.opponentId.toString() !== req.user
      !battle.creatorId.equals(req.user) &&
      !(battle.opponentId && battle.opponentId.equals(req.user))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
   
const question = battle.questionId;
console.log("🔥 QUESTION FROM DB:", question)
res.json({
  _id: question._id,
  title: question.title,
  description: question.description,
  topic: question.topic,
  difficulty: question.difficulty,
  constraints: question.constraints,
  sampleInput: question.sampleInput,
  sampleOutput: question.sampleOutput,
  functionName: question.functionName,
  parameters: question.parameters,
  paramTypes: question.paramTypes,
  returnType: question.returnType,
  testCases: {
    public: question.testCases.public,
  },
});

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question" });
  }
};
