import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    battleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Battle",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    speedScore: Number,
    optimizationScore: Number,

    strengths: String,
    weaknesses: String,
  },
  { timestamps: true }
);
export default mongoose.model("analytics",analyticsSchema)