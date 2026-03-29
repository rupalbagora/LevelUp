import Battle from "../models/Battle.js";
import Question from "../models/question.js";
export const joinBattle = async (req, res) => {
  try {
    const { battleId } = req.params;

    const battle = await Battle.findById(battleId);
    console.log(".....",battle)
     if (!battle) {
       return res.status(404).json({ message: "Battle not found" });
     }

    if (battle.status !== "waiting") {
      return res.status(400).json({ message: "Battle already started" });
    }

    if (battle.creatorId.toString() === req.user) {
      return res.status(400).json({ message: "Cannot join your own battle" });
    }

    const questions = await Question.find({
      topic: battle.topic,
      difficulty : battle.difficulty,
    });
    console.log("hey",questions)

    if(questions.length === 0){
      return res.status(400).json({
        message:"No quations available for this topic and difficulty",
      })
    }

    //Pick random question
    const randomIndex = Math.floor(Math.random()*questions.length);
    const selectedQuestion = questions[randomIndex];



const BATTLE_DURATION = 30 * 60 * 1000; // 30 minutes
battle.startTime = new Date();
battle.endTime = new Date(Date.now() + BATTLE_DURATION);

   
    // Assign question + opponent
    battle.opponentId = req.user;
    battle.questionId = selectedQuestion._id;
    battle.status = "ongoing";
    // battle.startTime = new Date();

    await battle.save();

    res.json({ message: "Joined battle successfully" ,
      questionId : selectedQuestion._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to join battle" , error});
    
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
      battle.creatorId.toString() !== req.user &&
      battle.opponentId.toString() !== req.user
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
const question = battle.questionId;

res.json({
  _id: question._id,
  title: question.title,
  description: question.description,
  topic: question.topic,
  difficulty: question.difficulty,
  constraints: question.constraints,
  sampleInput: question.sampleInput,
  sampleOutput: question.sampleOutput,
  testCases: {
    public: question.testCases.public,
  },
});

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question" });
  }
};
