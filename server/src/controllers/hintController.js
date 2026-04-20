import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import Battle from "../models/Battle.js";
import AIHint from "../models/AiHint.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAIHint = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { currentCode, problemStatement, type } = req.body;

    // 1. ✅ Invalid userId check
    if (!mongoose.Types.ObjectId.isValid(req.user)) {
      return res.status(401).json({ message: "Invalid user" });
    }
    const userId = new mongoose.Types.ObjectId(req.user);

    // 2. ✅ Invalid battleId check
    if (!mongoose.Types.ObjectId.isValid(battleId)) {
      return res.status(400).json({ message: "Invalid battle ID" });
    }

    // 3. ✅ Validation
    if (!type) {
      return res.status(400).json({ message: "Type required" });
    }

    if (!["quick", "detailed"].includes(type)) {
      return res.status(400).json({ message: "Invalid hint type" });
    }

    // ✅ problemStatement missing check
    if (!problemStatement) {
      return res.status(400).json({ message: "Problem statement required" });
    }

    // ✅ problemStatement too large check
    if (problemStatement.length > 5000) {
      return res
        .status(400)
        .json({ message: "Problem statement too large (max 5000 chars)" });
    }

    const battle = await Battle.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

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
    });

    // Cache hit — count nahi badhega
    if (existingHint) {
      const currentHints = isCreator
        ? battle.hintsUsed?.creator || 0
        : battle.hintsUsed?.opponent || 0;

      return res.json({
        hint: existingHint.hintText,
        hintsRemaining: 3 - currentHints,
        source: "cache",
      });
    }

    // 9. ✅ Cache miss — Atomic count badhao
    const updatedBattle = await Battle.findOneAndUpdate(
      {
        _id: battleId,
        [updateField]: { $lt: 3 },
      },
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!updatedBattle) {
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
  }
};