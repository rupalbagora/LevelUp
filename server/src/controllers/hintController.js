<<<<<<< HEAD
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import Battle from "../models/Battle.js";
import AIHint from "../models/AiHint.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
=======
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
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09

export const getAIHint = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { currentCode, problemStatement, type } = req.body;

<<<<<<< HEAD
    // 1. ✅ Invalid userId check
=======
    // 1. ✅ Basic Validations
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
    if (!mongoose.Types.ObjectId.isValid(req.user)) {
      return res.status(401).json({ message: "Invalid user" });
    }
    const userId = new mongoose.Types.ObjectId(req.user);

<<<<<<< HEAD
    // 2. ✅ Invalid battleId check
=======
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
    if (!mongoose.Types.ObjectId.isValid(battleId)) {
      return res.status(400).json({ message: "Invalid battle ID" });
    }

<<<<<<< HEAD
    // 3. ✅ Validation
    if (!type) {
      return res.status(400).json({ message: "Type required" });
    }

    if (!["quick", "detailed"].includes(type)) {
      return res.status(400).json({ message: "Invalid hint type" });
    }

    // ✅ problemStatement missing check
=======
    if (!type || !["quick", "detailed"].includes(type)) {
      return res.status(400).json({ message: "Valid hint type (quick/detailed) required" });
    }
    
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
    if (!problemStatement) {
      return res.status(400).json({ message: "Problem statement required" });
    }

<<<<<<< HEAD
    // ✅ problemStatement too large check
    if (problemStatement.length > 5000) {
      return res
        .status(400)
        .json({ message: "Problem statement too large (max 5000 chars)" });
    }

=======
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
    const battle = await Battle.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

<<<<<<< HEAD
    // 4. ✅ Battle active check
    const activeBattleStatuses = ["ongoing", "active"];
    if (!activeBattleStatuses.includes(battle.status)) {
      return res.status(400).json({ message: "Battle is not active" });
    }

    // 5. ✅ Check user is part of battle
    if (
      !battle.creatorId.equals(userId) &&
      !(battle.opponentId && battle.opponentId.equals(userId))
    ) {
      return res.status(403).json({ message: "Not part of this battle" });
    }

    // 6. Role check
    const isCreator = battle.creatorId.equals(userId);
    const updateField = isCreator ? "hintsUsed.creator" : "hintsUsed.opponent";

    // 7. ✅ Code aur problem trim karo (Token limit safe)
    const trimmedCode = (currentCode || "").slice(0, 3000);
    const trimmedProblem = problemStatement.slice(0, 2000);

    // 8. ✅ Cache check PEHLE (count mat badhao)
    const codeHash = crypto
      .createHash("md5")
      .update(trimmedProblem + trimmedCode + type)
      .digest("hex");

    const existingHint = await AIHint.findOne({
      battleId,
      userId,
      hintHash: codeHash,
=======
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
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
    });

    // Cache hit — count nahi badhega
    if (existingHint) {
<<<<<<< HEAD
      const currentHints = isCreator
        ? battle.hintsUsed?.creator || 0
        : battle.hintsUsed?.opponent || 0;

      return res.json({
        hint: existingHint.hintText,
        hintsRemaining: 3 - currentHints,
=======
      return res.json({
        hint: existingHint.hintText,
        hintsRemaining: totalAllowedLimit - currentUsed,
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
        source: "cache",
      });
    }

<<<<<<< HEAD
    // 9. ✅ Cache miss — Atomic count badhao
    const updatedBattle = await Battle.findOneAndUpdate(
      {
        _id: battleId,
        [updateField]: { $lt: 3 },
=======
    // 🔒 ATOMIC UPDATE: Check against dynamic limit & Status
    const updatedBattle = await Battle.findOneAndUpdate(
      { 
        _id: battleId, 
        [updateField]: { $lt: totalAllowedLimit },
        status: { $in: ["ongoing", "active"] }
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
      },
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!updatedBattle) {
<<<<<<< HEAD
      return res.status(400).json({ message: "Hint limit reached (3)" });
    }

    // 10. ✅ Stable model + enough tokens
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // ✅ Stable + Free (2.5-flash se better)
      generationConfig: {
        maxOutputTokens: type === "quick" ? 150 : 400, // ✅ 40/120 se badha ke 150/400
        temperature: 0.7,
      },
    });

    const prompt = `
      You are a competitive programming mentor.
      
      Problem:
      ${trimmedProblem}
      
      User Code:
      ${trimmedCode}
      
      Type: ${type}
      
      Instructions:
      - If quick → give ONLY 1-line hint.
      - If detailed → explain step-by-step logic mistake.
      - DO NOT give code snippets.
      - DO NOT give the full solution.
      - Max words: 50.
      - Make it concise and clear.
      - Always focus on the logic and approach, not syntax.
      - The goal is to guide the user to find the solution themselves!
      - If the code looks perfect, give a nudge in the right direction.
      - Maintain a positive and encouraging tone.
    `;

    let hintText;
    try {
      const result = await model.generateContent(prompt);

      // ✅ Primary way se nikalo
      hintText = result?.response?.text()?.trim();

      // ✅ Fallback — candidates se try karo
      if (!hintText) {
        const candidates = result?.response?.candidates;
        hintText = candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      }

      // ✅ Ab bhi empty hai toh rollback
      if (!hintText) {
        await Battle.findByIdAndUpdate(battleId, {
          $inc: { [updateField]: -1 },
        });
        return res
          .status(500)
          .json({ message: "AI returned empty hint, try again" });
      }
    } catch (aiError) {
      // ✅ AI fail — count rollback
      await Battle.findByIdAndUpdate(battleId, {
        $inc: { [updateField]: -1 },
      });
      console.error("AI call failed:", aiError);
      return res
        .status(500)
        .json({ message: "AI service failed, hint not consumed" });
    }

    // 11. ✅ Hint save karo — fail hone par sirf log karo
=======
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
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
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

<<<<<<< HEAD
    // 12. ✅ used undefined nahi hoga
    const used = isCreator
      ? updatedBattle.hintsUsed?.creator || 0
      : updatedBattle.hintsUsed?.opponent || 0;

    // 13. Final Response
    res.json({
      hint: hintText,
      hintsRemaining: 3 - used,
      source: "api",
    });
  } catch (error) {
    console.error("AI HINT ERROR:", error);
    res.status(500).json({
      message: error.message,
      fullError: error.toString(),
    });
=======
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
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
  }
};