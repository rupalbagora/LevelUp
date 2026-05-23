import axios from "axios";
import crypto from "crypto";
import mongoose from "mongoose";
import Battle from "../models/Battle.js";
import AIHint from "../models/AiHint.js";

// --- Helper Function: Code ko saaf karne ke liye (Smart Hashing) ---
const cleanCodeForHashing = (code) => {
  if (!code) return "";
  return code
    .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "") // Comments hatao
    .replace(/\s+/g, "") // Saari spaces, tabs aur newlines hatao
    .trim();
};

export const getAIHint = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { currentCode, problemStatement, type } = req.body;

    // 1. ✅ Basic Validations
    if (!mongoose.Types.ObjectId.isValid(req.user)) {
      return res.status(401).json({ message: "Invalid user" });
    }
    const userId = new mongoose.Types.ObjectId(req.user);

    if (!mongoose.Types.ObjectId.isValid(battleId)) {
      return res.status(400).json({ message: "Invalid battle ID" });
    }

    if (!type || !["quick", "detailed"].includes(type)) {
      return res.status(400).json({ message: "Valid hint type (quick/detailed) required" });
    }
    
    if (!problemStatement) {
      return res.status(400).json({ message: "Problem statement required" });
    }

    const battle = await Battle.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    // 2. ✅ Battle Active Check (Edge Case: Finished/Timeout)
    if (battle.status === "completed") {
      return res.status(400).json({ message: "Battle has already ended. Hints are no longer available." });
    }
    if (!["ongoing", "active"].includes(battle.status)) {
      return res.status(400).json({ message: "Battle is not active right now." });
    }

    // 3. ✅ Check user part of battle
    const isCreator = battle.creatorId.equals(userId);
    const isOpponent = battle.opponentId && battle.opponentId.equals(userId);
    if (!isCreator && !isOpponent) {
      return res.status(403).json({ message: "Not part of this battle" });
    }

    const updateField = isCreator ? "hintsUsed.creator" : "hintsUsed.opponent";

    // 🏆 REWARD LOGIC: Total allowed = 3 (Base) + Extra (Reward)
    const extraAvailable = isCreator 
      ? (battle.extraHints?.creator || 0) 
      : (battle.extraHints?.opponent || 0);
    const totalAllowedLimit = 3 + extraAvailable;
    const currentUsed = isCreator 
      ? (battle.hintsUsed?.creator || 0) 
      : (battle.hintsUsed?.opponent || 0);

    // 4. ✅ Pre-check Hint Limit (Edge Case: Stop if limit reached)
    if (currentUsed >= totalAllowedLimit) {
      return res.status(400).json({ 
        message: `Hint limit reached! You have used all ${totalAllowedLimit} hints.`,
        hintsRemaining: 0,
        limitReached: true
      });
    }

    // 5. ✅ Smart English Instructions & Empty Code Handling
    const isCodeEmpty = !currentCode || currentCode.trim().length < 5;
    
    // AI ko strictly English mein aur logic par focus karne ke liye instructions
    const systemInstruction = isCodeEmpty 
      ? "You are a competitive programming mentor. The user has not written code yet. Explain the conceptual approach or the first step in plain English. STRICTLY DO NOT use any language other than English. DO NOT give any code."
      : "You are a competitive programming mentor. Analyze the user's code and suggest the next logical step in plain English. STRICTLY DO NOT use any language other than English. DO NOT give the full solution or code.";

    // 🛡️ SMART CACHING: Code saaf karke hash banao
    const cleaned = cleanCodeForHashing(currentCode || "");
    const trimmedProblem = problemStatement.slice(0, 2000);
    
    const codeHash = crypto
      .createHash("md5")
      .update(trimmedProblem + cleaned + type)
      .digest("hex");

    const existingHint = await AIHint.findOne({ 
      battleId, 
      userId, 
      hintHash: codeHash 
    });

    // Cache hit — count nahi badhega
    if (existingHint) {
      return res.json({
        hint: existingHint.hintText,
        hintsRemaining: totalAllowedLimit - currentUsed,
        source: "cache",
      });
    }

    // 🔒 ATOMIC UPDATE: Check against dynamic limit & Status
    const updatedBattle = await Battle.findOneAndUpdate(
      { 
        _id: battleId, 
        [updateField]: { $lt: totalAllowedLimit },
        status: { $in: ["ongoing", "active"] }
      },
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!updatedBattle) {
      return res.status(400).json({ 
        message: "Unable to process hint. Hint limit reached or battle state changed." 
      });
    }

    // 🌐 OPENROUTER CALL (Strict English Version)
    let hintText;
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "google/gemini-2.0-flash-001",
          messages: [
            { 
              role: "system", 
              content: `${systemInstruction} Keep your response concise and under 60 words.` 
            },
            { 
              role: "user", 
              content: `Problem: ${trimmedProblem}\nUser Code: ${(currentCode || "No code provided yet").slice(0, 3000)}\nHint Type: ${type}` 
            }
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 15000 
        }
      );

      hintText = response.data.choices[0]?.message?.content?.trim();
      if (!hintText) throw new Error("AI returned empty content");

    } catch (aiError) {
      // ✅ AI fail — count rollback
      await Battle.findByIdAndUpdate(battleId, { $inc: { [updateField]: -1 } });
      console.error("OpenRouter Error:", aiError.response?.data || aiError.message);
      return res.status(500).json({ message: "AI service failed, hint not consumed." });
    }

    // ✅ Hint save karo
    try {
      await AIHint.create({
        battleId,
        userId,
        hintType: type,
        hintText,
        hintHash: codeHash,
      });
    } catch (dbError) {
      console.error("Hint save failed:", dbError);
    }

    // Final Response
    const finalUsed = isCreator 
      ? (updatedBattle.hintsUsed?.creator || 0) 
      : (updatedBattle.hintsUsed?.opponent || 0);

    res.json({
      hint: hintText,
      hintsRemaining: totalAllowedLimit - finalUsed,
      isLastHint: (totalAllowedLimit - finalUsed) === 0,
      source: "api",
    });

  } catch (error) {
    console.error("AI HINT ERROR:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};