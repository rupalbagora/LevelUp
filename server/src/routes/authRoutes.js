import express from "express"
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth
} from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout", logoutUser);
// router.get("/check-auth", protect, (req, res) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     message: "Authenticated user!",
//     user,
//   });
// });
router.get("/check-auth", protect, checkAuth);
export default router;