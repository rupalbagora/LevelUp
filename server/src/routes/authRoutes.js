import express from "express"
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  forgotPassword,
  resetPassword,
  googleAuth,
} from "../controllers/authController.js";
import { getBanStatus } from "../controllers/cheatController.js";
import protect from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleAuth);
// router.get("/check-auth", protect, (req, res) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     message: "Authenticated user!",
//     user,
//   });
// });
router.get("/check-auth", protect, checkAuth);
router.get("/ban-status", protect, getBanStatus);
export default router;
