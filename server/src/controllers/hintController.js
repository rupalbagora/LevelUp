// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Battle from "../models/Battle.js";
// import AIHint from "../models/AiHint.js";

// // Gemini Setup
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const getAIHint = async (req, res) => {
//   try {
//     const { battleId, currentCode, problemStatement, type } = req.body;

//     // req.user check (Sometime it's an object, sometimes a string)
//     const userId = req.user;

//     if (!battleId || !type) {
//       return res.status(400).json({ message: "Battle ID is required" });
//     }

//     const battle = await Battle.findById(battleId);
//     if (!battle) return res.status(404).json({ message: "Battle not found" });

//     // 1. Check User Role & Hint Limit (Max 3)
//     const isCreator = battle.creatorId.equals(userId);
//     const currentHints = isCreator ? (battle.hintsUsed?.creator || 0) : (battle.hintsUsed?.opponent || 0);

//     if (currentHints >= 3) {
//       return res.status(400).json({
//         message: "LIMIT DONE: You've reached your 3-hint limit for this battle!"
//       });
//     }

//     // 2. Call Gemini 1.5 Flash (More stable for now)
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = `
//       Act as a competitive programming mentor.
//       Problem Statement: ${problemStatement}
//       User's Current Code: ${currentCode}
//       Hint Type: ${type === 'quick' ? 'A very subtle one-line logical hint' : 'A detailed logical step-by-step breakdown'}

//       Rules:
//       - DO NOT provide any code snippets.
//       - DO NOT give the full solution.
//       - Help the user think about the next logical step.
//       - Keep it under 100 words.
//     `;

//     const result = await model.generateContent(prompt);
//     const hintText = result.response.text();

//     // 3. Save to AIHint Collection (Optional but good for logs)
//     await AIHint.create({
//       battleId,
//       userId,
//       hintType: type,
//       hintText: hintText
//     });

//     // 4. Update Battle Model Count (Using atomic update to avoid errors)
//     if (isCreator) {
//       battle.hintsUsed.creator = (battle.hintsUsed.creator || 0) + 1;
//     } else {
//       battle.hintsUsed.opponent = (battle.hintsUsed.opponent || 0) + 1;
//     }

//     await battle.save();

//     const finalHintsRemaining = 3 - (isCreator ? battle.hintsUsed.creator : battle.hintsUsed.opponent);

//     res.status(200).json({
//       hint: hintText,
//       hintsRemaining: finalHintsRemaining
//     });

//   } catch (error) {
//     console.error("AI HINT ERROR:", error);
//     res.status(500).json({
//       message: "AI Assistant is resting. Try again!",
//       error: error.message
//     });
//   }
// };

export const getAIHint = async (req, res) => {
  try {
    const { battleId, currentCode, problemStatement, type } = req.body;
    const userId = req.user;

    // 1. Validate input
    if (!battleId || !type) {
      return res.status(400).json({ message: "Battle ID and type required" });
    }

    if (!["quick", "detailed"].includes(type)) {
      return res.status(400).json({ message: "Invalid hint type" });
    }

    const battle = await Battle.findById(battleId);
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    // 2. Check user is part of battle
    if (
      !battle.creatorId.equals(userId) &&
      !(battle.opponentId && battle.opponentId.equals(userId))
    ) {
      return res.status(403).json({ message: "Not part of this battle" });
    }

    // 3. Role + hint count
    const isCreator = battle.creatorId.equals(userId);

    const currentHints = isCreator
      ? battle.hintsUsed?.creator || 0
      : battle.hintsUsed?.opponent || 0;

    if (currentHints >= 3) {
      return res.status(400).json({
        message: "Hint limit reached (3)",
      });
    }

    // 4. Generate AI hint
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a competitive programming mentor.

      Problem:
      ${problemStatement}

      User Code:
      ${currentCode}

      Type: ${type}

      Instructions:
      - If quick → give ONLY 1-line hint
      - If detailed → explain step-by-step logic mistake
      - DO NOT give code
      - DO NOT give full solution
      - Focus on user's mistake or next step
      - Max 80 words
    `;

    const result = await model.generateContent(prompt);
    const hintText = result.response.text();

    // 5. Save hint history
    await AIHint.create({
      battleId,
      userId,
      hintType: type,
      hintText,
    });

    // 6. Atomic update
    const updateField = isCreator ? "hintsUsed.creator" : "hintsUsed.opponent";

    await Battle.findByIdAndUpdate(battleId, {
      $inc: { [updateField]: 1 },
    });

    // 7. Get updated count
    const updatedBattle = await Battle.findById(battleId);

    const used = isCreator
      ? updatedBattle.hintsUsed.creator
      : updatedBattle.hintsUsed.opponent;

    // 8. Response
    res.json({
      hint: hintText,
      hintsRemaining: 3 - used,
    });
  } catch (error) {
    console.error("AI HINT ERROR:", error);
    res.status(500).json({
      message: "AI Assistant is resting. Try again!",
    });
  }
};