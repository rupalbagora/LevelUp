import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/update", protect, updateUserProfile);

export default router;
