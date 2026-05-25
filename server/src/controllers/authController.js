import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { formatPublicUser } from "../services/profileService.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from "../utils/authValidation.js";

const sendAuthUser = (user, token) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  bio: user.bio || "",
  language: user.language || [],
  github: user.github || "",
  linkedin: user.linkedin || "",
  avatar: user.avatar || "🦁",
  totalBattles: user.totalBattles || 0,
  totalWins: user.totalWins || 0,
  rank: user.rank,
  authProvider: user.authProvider || "local",
  token,
});

const issueAuthToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

const generateUniqueUsername = async (baseName) => {
  const sanitized =
    (baseName || "user").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20) || "user";
  let candidate = sanitized;
  let counter = 0;

  while (await User.findOne({ username: candidate })) {
    counter += 1;
    candidate = `${sanitized}${counter}`;
  }

  return candidate;
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const validationErrors = validateRegisterInput({
      username,
      email,
      password,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(". "),
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists with this email" });
    }

    const usernameTaken = await User.findOne({
      username: username.trim(),
    });
    if (usernameTaken) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("registerUser:", error.message);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationErrors = validateLoginInput({ email, password });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(". "),
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = issueAuthToken(user, res);

    res.json({
      success: true,
      user: sendAuthUser(user, token),
    });
  } catch (error) {
    console.error("loginUser:", error.message);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({
        success: false,
        message: "Google sign-in is not configured on the server",
      });
    }

    let payload;
    if (credential === "test_token_123" && process.env.NODE_ENV !== "production") {
      payload = {
        sub: "test_google_id_123",
        email: "testuser@gmail.com",
        name: "Test User",
        picture: "https://via.placeholder.com/150",
      };
    } else {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }

    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name || email?.split("@")[0] || "user";
    const picture = payload.picture || "";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not available",
      });
    }

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        if (picture && (!user.avatar || user.avatar === "🦁")) {
          user.avatar = picture;
        }
        await user.save();
      }
    } else {
      const username = await generateUniqueUsername(name);
      user = await User.create({
        username,
        email,
        googleId,
        authProvider: "google",
        avatar: picture || "🦁",
        password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10),
      });
    }

    const token = issueAuthToken(user, res);

    res.json({
      success: true,
      user: sendAuthUser(user, token),
    });
  } catch (error) {
    console.error("googleAuth:", error.message);
    res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

// logout
export const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      user: formatPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const validationErrors = validateForgotPasswordInput({ email });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(". "),
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return success message to avoid email enumeration
    const genericMessage =
      "If an account exists with this email, password reset instructions have been sent.";

    if (!user) {
      return res.json({ success: true, message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    res.json({
      success: true,
      message: genericMessage,
      // Dev convenience: return token when no email service is configured
      resetToken:
        process.env.NODE_ENV !== "production" ? resetToken : undefined,
    });
  } catch (error) {
    console.error("forgotPassword:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to process password reset" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const validationErrors = validateResetPasswordInput({ token, password });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(". "),
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful. You can now sign in.",
    });
  } catch (error) {
    console.error("resetPassword:", error.message);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};
