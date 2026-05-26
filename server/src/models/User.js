import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    rank: {
      type: String,
      default: "Beginner",
    },
    totalWins: {
      type: Number,
      default: 0,
    },
    totalBattles: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    language: {
      type: [String],
      default: [],
    },
    github: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "🦁",
    },
    
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
