import mongoose from "mongoose";

const blackCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  battleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Battle",
  },

  reason: String,

  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },

  issuedAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: Date,
});
export default mongoose.model("blackcard", blackCardSchema);
