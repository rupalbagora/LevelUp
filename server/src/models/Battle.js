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
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },

    status: {
      type: String,
      enum: ["waiting", "ongoing", "completed"],
      default: "waiting",
    },
    completedAt: {
      type: Date,
      default: null,
    },
timeoutScheduled: {
  type: Boolean,
  default: false,
}, 
    startTime: Date,
    endTime: Date,
    extendedEndTime: Date,
    firstSubmissionTime: Date,
  },
  { timestamps: true },
);
export default mongoose.model("Battle", battleSchema);
