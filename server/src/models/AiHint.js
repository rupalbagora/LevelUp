import mongoose from "mongoose";

const aiHintSchema = new mongoose.Schema({
  battleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Battle",
  },

  hintType: {
    type: String,
    enum: ["quick", "detailed"],
  },

  hintText: String,
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("aiHint", aiHintSchema);