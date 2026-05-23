import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  title: String,
  description: String,

  topic: {
    type: String,
    enum: [
      "Arrays",
      "Strings",
      "Linked Lists",
      "Recursion",
      "Trees & Graphs",
      "Dynamic Programming",
      "Binary Search",
      "Sorting Algorithms",
    ],
    required: true,
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  functionName: {
    type: String,
    required: true,
  },

  parameters: {
    type: [String],
    required: true,
  },
  paramTypes: [String], // NEW FIELD
  returnType: { type: String, default: "number" },
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