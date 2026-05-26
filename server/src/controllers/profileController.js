import User from "../models/User.js";
import {
  buildUserProfilePayload,
  formatPublicUser,
} from "../services/profileService.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/i;

export const getUserProfile = async (req, res) => {
  try {
    const payload = await buildUserProfilePayload(req.user);
    if (!payload) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, ...payload });
  } catch (error) {
    console.error("getUserProfile:", error.message);
    res.status(500).json({ success: false, message: "Failed to load profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, bio, language, github, linkedin, avatar } = req.body;
    const errors = [];

    if (username !== undefined) {
      const trimmed = String(username).trim();
      if (trimmed.length < 3 || trimmed.length > 30) {
        errors.push("Username must be between 3 and 30 characters");
      }
    }

    if (bio !== undefined && String(bio).length > 500) {
      errors.push("Bio must be 500 characters or less");
    }

    if (language !== undefined && !Array.isArray(language)) {
      errors.push("Languages must be an array");
    }

    if (github && github.trim() && !URL_REGEX.test(github.trim())) {
      errors.push("GitHub URL must start with http:// or https://");
    }

    if (linkedin && linkedin.trim() && !URL_REGEX.test(linkedin.trim())) {
      errors.push("LinkedIn URL must start with http:// or https://");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(". ") });
    }

    if (username) {
      const existing = await User.findOne({
        username: String(username).trim(),
        _id: { $ne: req.user },
      });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Username already taken" });
      }
    }

    const update = {};
    if (username !== undefined) update.username = String(username).trim();
    if (bio !== undefined) update.bio = String(bio).trim();
    if (language !== undefined) update.language = language;
    if (github !== undefined) update.github = String(github).trim();
    if (linkedin !== undefined) update.linkedin = String(linkedin).trim();
    if (avatar !== undefined) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: formatPublicUser(user),
    });
  } catch (error) {
    console.error("updateUserProfile:", error.message);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
};
