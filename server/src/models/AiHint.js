import mongoose from "mongoose";

const aiHintSchema = new mongoose.Schema({
  battleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Battle",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hintType: {
    type: String,
    enum: ["quick", "detailed"],
  },
  hintText: String,
  hintHash: {
    type: String,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AIHint", aiHintSchema);