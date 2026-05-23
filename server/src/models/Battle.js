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
    hintsUsed: {
  creator: { type: Number, default: 0 },
  opponent: { type: Number, default: 0 },
},
<<<<<<< HEAD
=======
    extraHints: {
  creator: { type: Number, default: 0 }, // Reward se milne wale hints
  opponent: { type: Number, default: 0 },

},
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09

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
