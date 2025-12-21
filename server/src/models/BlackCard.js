import mongoose from "mongoose";

const blackCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  reason: String,

  issuedAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: Date,
});
export default mongoose.model("blackcard", blackCardSchema);