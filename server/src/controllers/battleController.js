import Battle from "../models/Battle.js";
//battle creating logic he ye okay hai, isme creatorId ko req.user se set kar rahe hain,
// jo auth middleware se aata hai. Ye ensure karta hai ki battle sirf authenticated user hi create kar sakta hai.
export const createBattle = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
if (!topic || !difficulty) {
  return res.status(400).json({ message: "Topic and difficulty required" });
}

    const battle = await Battle.create({
      topic,
      difficulty,
      creatorId: req.user,
    });

    res.status(201).json({
      message: "Battle created",
      battleId: battle._id,
    });
    console.log("Created battle:", battle._id);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Battle creation failed" });
  }
};
////////////////////////////////////////////////////////////////////////////

// controllers/battleController.js mein ye do functions add kiya hain, jo opponent ke liye battle join karne aur battle terminate karne ke liye hain.

// 1. Battle Join karna (Opponent ke liye)
// 1. Join logic update (Sirf status check karne ke liye)
export const joinBattle = async (req, res) => {
  try {
    const { battleId } = req.params;
    const battle = await Battle.findById(battleId);

    if (!battle) return res.status(404).json({ message: "Battle not found" });

    // Link Expiry ya Decline Check
    if (battle.status === "cancelled") {
      return res.status(200).json({ status: "cancelled", message: "Link expired or declined" });
    }

    // Status return karo bina change kiye
    res.status(200).json({ 
      status: battle.status, 
      topic: battle.topic, 
      difficulty: battle.difficulty 
    });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

// 2. Naya Accept function (Jab Opponent button dabaye)
export const acceptBattle = async (req, res) => {
  try {
    const { battleId } = req.params;
    const battle = await Battle.findById(battleId);
    
    if (battle.status !== "waiting") return res.status(400).json({ message: "Not available" });

    battle.opponentId = req.user; // Auth middleware se user ID
    battle.status = "ongoing"; 
    await battle.save();

    res.status(200).json({ status: "ongoing" });
  } catch (error) {
    res.status(500).json({ message: "Acceptance failed" });
  }
};

// 2. Battle Deny/Terminate karna
export const terminateBattle = async (req, res) => {
  try {
    const { battleId } = req.params;
    // Status 'cancelled' kar dete hain taaki sender ko pata chale
    await Battle.findByIdAndUpdate(battleId, { status: "cancelled" });
    res.status(200).json({ message: "Battle terminated" });
  } catch (error) {
    res.status(500).json({ message: "Termination failed" });
  }
};
///////////////////////////////////////////////////////////////////////////////////////