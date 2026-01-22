import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  title: String,
  description: String,

  topic: {
    type: String,
    enum: [
      "Arrays",
      "Strings",
      "LinkedList",
      "Recursion",
      "Trees",
      "Graphs",
      "DP",
    ],
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },

  constraints: String,

  sampleInput: String,
  sampleOutput: String,

  testCases: {
    public: [{ input: String, output: String }],
    hidden: [{ input: String, output: String }],
  },
});
const Question = mongoose.model("Question", questionSchema);

export default Question;