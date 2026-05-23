import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  battleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Battle",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  code: String,
  language: String,
  isCorrect: Boolean,

  runtimeMs: Number,
  memoryUsedKb: Number,
  timeComplexity: String,
  spaceComplexity: String,

  submittedAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("Submission", submissionSchema);