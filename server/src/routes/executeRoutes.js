import express from "express";
import { executeCode } from "../services/codeExecutor.js";

const router = express.Router();

router.post("/execute", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing code or language" });
  }

  const result = await executeCode({ code, language });

  res.json(result);
});

export default router;
