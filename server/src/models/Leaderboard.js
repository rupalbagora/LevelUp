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
const Leaderboard =
  mongoose.models.leaderboard ||
  mongoose.model("leaderboard", leaderboardSchema);

export default Leaderboard;
