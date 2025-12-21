import mongoose from "mongoose";
const battleSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    opponentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["waiting", "ongoing", "completed"],
      default: "waiting",
    },

    startTime: Date,
    endTime: Date,
  },
  { timestamps: true }
);
export default mongoose.model("Battle", battleSchema);
