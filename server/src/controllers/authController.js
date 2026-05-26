import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import {
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
} from "../utils/authValidation.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const buildAuthUser = (user, token) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  totalBattles: user.totalBattles || 0,
  totalWins: user.totalWins || 0,
  token,
});

const sendAuthResponse = (res, user, message = "Login successful") => {
  const token = createToken(user);
  setAuthCookie(res, token);
  return res.json({
    success: true,
    message,
    user: buildAuthUser(user, token),
  });
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const errors = validateRegisterInput({ username, email, password });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validateLoginInput({ email, password });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Please sign in with Google for this account",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Password" });
    }

    return sendAuthResponse(res, user);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

// logout
export const logoutUser = (req, res) => {
  res.clearCookie("token", { path: "/" }).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      user: buildAuthUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const errors = validateForgotPasswordInput({ email });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset token generated",
      resetToken,
      token: resetToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.body;
    const password = req.body.password || req.body.newPassword;
    const errors = validateResetPasswordInput({ token, password });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.authProvider = user.googleId ? user.authProvider : "local";
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Password reset failed" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ success: false, message: "Google sign-in is not configured" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ success: false, message: "Google account email not found" });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = payload.sub;
        user.authProvider = user.authProvider || "local";
        await user.save();
      }
    } else {
      user = await User.create({
        username: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        authProvider: "google",
      });
    }

    return sendAuthResponse(res, user, "Google sign-in successful");
  } catch (error) {
    return res.status(401).json({ success: false, message: "Google sign-in failed" });
  }
};
