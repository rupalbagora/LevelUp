import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  score: Number,
  rankPosition: Number,

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("leaderboard", leaderboardSchema);