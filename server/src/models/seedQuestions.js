import mongoose from "mongoose";
import dotenv from "dotenv";
// dotenv.config({ path: "../../.env" });
dotenv.config();

import connectDb from "../config/db.js";
import Question from "./question.js";

// const questions = [
//   // ================= ARRAYS (EASY) =================
//   {
//     title: "Largest Element in Array",
//     description: "Find the largest element in a given array of integers.",
//     topic: "Arrays",
//     difficulty: "Easy",
//     constraints: "1 ≤ N ≤ 10^5",
//     sampleInput: "[3, 1, 5, 2, 4]",
//     sampleOutput: "5",
//     testCases: {
//       public: [{ input: "[1,2,3,4,5]", output: "5" }],
//       hidden: [
//         { input: "[10]", output: "10" },
//         { input: "[5,5,5]", output: "5" },
//       ],
//     },
//   },

//   {
//     title: "Check Sorted Array",
//     description: "Check if the array is sorted in non-decreasing order.",
//     topic: "Arrays",
//     difficulty: "Easy",
//     constraints: "1 ≤ N ≤ 10^5",
//     sampleInput: "[1,2,3,4]",
//     sampleOutput: "true",
//     testCases: {
//       public: [{ input: "[1,2,3,4]", output: "true" }],
//       hidden: [
//         { input: "[4,3,2,1]", output: "false" },
//         { input: "[1]", output: "true" },
//       ],
//     },
//   },

//   // ================= ARRAYS (MEDIUM) =================
//   {
//     title: "Two Sum Indices",
//     description: "Return indices of two numbers whose sum equals the target.",
//     topic: "Arrays",
//     difficulty: "Medium",
//     constraints: "2 ≤ N ≤ 10^5",
//     sampleInput: "[2,7,11,15], target = 9",
//     sampleOutput: "[0,1]",
//     testCases: {
//       public: [{ input: "[2,7,11,15],9", output: "[0,1]" }],
//       hidden: [
//         { input: "[3,2,4],6", output: "[1,2]" },
//         { input: "[3,3],6", output: "[0,1]" },
//       ],
//     },
//   },

//   {
//     title: "Maximum Subarray Sum",
//     description: "Find the maximum sum of a contiguous subarray.",
//     topic: "Arrays",
//     difficulty: "Medium",
//     constraints: "1 ≤ N ≤ 10^5",
//     sampleInput: "[-2,1,-3,4,-1,2,1,-5,4]",
//     sampleOutput: "6",
//     testCases: {
//       public: [{ input: "[1,2,3]", output: "6" }],
//       hidden: [
//         { input: "[-1,-2,-3]", output: "-1" },
//         { input: "[5,-2,3]", output: "6" },
//       ],
//     },
//   },

//   // ================= STRINGS (EASY) =================
//   {
//     title: "Reverse a String",
//     description: "Reverse the given string.",
//     topic: "Strings",
//     difficulty: "Easy",
//     constraints: "1 ≤ length ≤ 10^5",
//     sampleInput: "hello",
//     sampleOutput: "olleh",
//     testCases: {
//       public: [{ input: "abc", output: "cba" }],
//       hidden: [
//         { input: "a", output: "a" },
//         { input: "race", output: "ecar" },
//       ],
//     },
//   },

//   // ================= STRINGS (MEDIUM) =================
//   {
//     title: "Check Palindrome",
//     description: "Check whether a string is a palindrome.",
//     topic: "Strings",
//     difficulty: "Medium",
//     constraints: "1 ≤ length ≤ 10^5",
//     sampleInput: "madam",
//     sampleOutput: "true",
//     testCases: {
//       public: [{ input: "madam", output: "true" }],
//       hidden: [
//         { input: "hello", output: "false" },
//         { input: "a", output: "true" },
//       ],
//     },
//   },

//   // ================= RECURSION (MEDIUM) =================
//   {
//     title: "Factorial Using Recursion",
//     description: "Compute factorial of a number using recursion.",
//     topic: "Recursion",
//     difficulty: "Medium",
//     constraints: "0 ≤ N ≤ 12",
//     sampleInput: "5",
//     sampleOutput: "120",
//     testCases: {
//       public: [{ input: "5", output: "120" }],
//       hidden: [
//         { input: "0", output: "1" },
//         { input: "7", output: "5040" },
//       ],
//     },
//   },

//   // ================= ARRAYS (HARD) =================
//   {
//     title: "Trapping Rain Water",
//     description: "Calculate total water trapped between bars.",
//     topic: "Arrays",
//     difficulty: "Hard",
//     constraints: "1 ≤ N ≤ 10^5",
//     sampleInput: "[0,1,0,2,1,0,1,3,2,1,2,1]",
//     sampleOutput: "6",
//     testCases: {
//       public: [{ input: "[0,1,0,2]", output: "1" }],
//       hidden: [{ input: "[4,2,0,3,2,5]", output: "9" }],
//     },
//   },

//   // ================= DP (HARD) =================
//   {
//     title: "Nth Fibonacci Number",
//     description: "Find the Nth Fibonacci number using dynamic programming.",
//     topic: "DP",
//     difficulty: "Hard",
//     constraints: "0 ≤ N ≤ 10^5",
//     sampleInput: "10",
//     sampleOutput: "55",
//     testCases: {
//       public: [{ input: "10", output: "55" }],
//       hidden: [
//         { input: "0", output: "0" },
//         { input: "1", output: "1" },
//       ],
//     },
//   },
// ];
const questions = [
  // ================= ARRAYS (EASY) =================
  {
    title: "Largest Element in Array",
    description: "Find the largest element in a given array of integers.",
    topic: "Arrays",
    difficulty: "Easy",
    constraints: "1 ≤ N ≤ 10^5, -10^9 ≤ nums[i] ≤ 10^9",

    functionName: "largestElement",
    parameters: ["nums"],
    paramTypes: ["int[]"],
    returnType: "number",

    sampleInput: "[3,1,5,2,4]",
    sampleOutput: "5",

    testCases: {
      public: [{ input: "[1,2,3,4,5]", output: "5" }],
      hidden: [
        { input: "[10]", output: "10" },
        { input: "[5,5,5]", output: "5" },
      ],
    },
  },

  {
    title: "Check Sorted Array",
    description: "Check if the array is sorted in non-decreasing order.",
    topic: "Arrays",
    difficulty: "Easy",
    constraints: "1 ≤ N ≤ 10^5, -10^9 ≤ nums[i] ≤ 10^9",

    functionName: "isSorted",
    parameters: ["nums"],
    paramTypes: ["int[]"],
    returnType: "boolean",

    sampleInput: "[1,2,3,4]",
    sampleOutput: "true",

    testCases: {
      public: [{ input: "[1,2,3,4]", output: "true" }],
      hidden: [
        { input: "[4,3,2,1]", output: "false" },
        { input: "[1]", output: "true" },
      ],
    },
  },

  // ================= ARRAYS (MEDIUM) =================
  {
    title: "Two Sum Indices",
    description: "Return indices of two numbers whose sum equals the target.",
    topic: "Arrays",
    difficulty: "Medium",
    constraints: "2 ≤ N ≤ 10^5, -10^9 ≤ nums[i], target ≤ 10^9",

    functionName: "twoSum",
    parameters: ["nums", "target"],
    paramTypes: ["int[]", "int"],
    returnType: "array",

    sampleInput: "[2,7,11,15]\n9",
    sampleOutput: "[0,1]",

    testCases: {
      public: [{ input: "[2,7,11,15]\n9", output: "[0,1]" }],
      hidden: [
        { input: "[3,2,4]\n6", output: "[1,2]" },
        { input: "[3,3]\n6", output: "[0,1]" },
      ],
    },
  },

  {
    title: "Maximum Subarray Sum",
    description: "Find the maximum sum of a contiguous subarray.",
    topic: "Arrays",
    difficulty: "Medium",
    constraints: "1 ≤ N ≤ 10^5, -10^4 ≤ nums[i] ≤ 10^4",

    functionName: "maxSubarray",
    parameters: ["nums"],
    paramTypes: ["int[]"],
    returnType: "number",

    sampleInput: "[-2,1,-3,4,-1,2,1,-5,4]",
    sampleOutput: "6",

    testCases: {
      public: [{ input: "[1,2,3]", output: "6" }],
      hidden: [
        { input: "[-1,-2,-3]", output: "-1" },
        { input: "[5,-2,3]", output: "6" },
      ],
    },
  },

  // ================= STRINGS =================
  {
    title: "Reverse a String",
    description: "Reverse the given string.",
    topic: "Strings",
    difficulty: "Easy",
    constraints: "1 ≤ length ≤ 10^5",

    functionName: "reverseString",
    parameters: ["s"],
    paramTypes: ["String"],
    returnType: "string",

    sampleInput: '"hello"',
    sampleOutput: '"olleh"',

    testCases: {
      public: [{ input: '"abc"', output: '"cba"' }],
      hidden: [
        { input: '"a"', output: '"a"' },
        { input: '"race"', output: '"ecar"' },
      ],
    },
  },

  {
    title: "Check Palindrome",
    description: "Check whether a string is a palindrome.",
    topic: "Strings",
    difficulty: "Medium",
    constraints: "1 ≤ length ≤ 10^5",

    functionName: "isPalindrome",
    parameters: ["s"],
    paramTypes: ["String"],
    returnType: "boolean",

    sampleInput: '"madam"',
    sampleOutput: "true",

    testCases: {
      public: [{ input: '"madam"', output: "true" }],
      hidden: [
        { input: '"hello"', output: "false" },
        { input: '"a"', output: "true" },
      ],
    },
  },

  // ================= RECURSION =================
  {
    title: "Factorial Using Recursion",
    description: "Compute factorial of a number using recursion.",
    topic: "Recursion",
    difficulty: "Medium",
    constraints: "0 ≤ N ≤ 12",

    functionName: "factorial",
    parameters: ["n"],
    paramTypes: ["int"],
    returnType: "number",

    sampleInput: "5",
    sampleOutput: "120",

    testCases: {
      public: [{ input: "5", output: "120" }],
      hidden: [
        { input: "0", output: "1" },
        { input: "7", output: "5040" },
      ],
    },
  },

  // ================= ARRAYS (HARD) =================
  {
    title: "Trapping Rain Water",
    description: "Calculate total water trapped between bars.",
    topic: "Arrays",
    difficulty: "Hard",
    constraints: "1 ≤ N ≤ 10^5, 0 ≤ height[i] ≤ 10^5",

    functionName: "trap",
    parameters: ["height"],
    returnType: "number",

    sampleInput: "[0,1,0,2,1,0,1,3,2,1,2,1]",
    sampleOutput: "6",

    testCases: {
      public: [{ input: "[0,1,0,2]", output: "1" }],
      hidden: [{ input: "[4,2,0,3,2,5]", output: "9" }],
    },
  },

  // ================= DP =================
  {
    title: "Nth Fibonacci Number",
    description: "Find the Nth Fibonacci number using dynamic programming.",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    constraints: "0 ≤ N ≤ 10^5",

    functionName: "fib",
    parameters: ["n"],
    returnType: "number",

    sampleInput: "10",
    sampleOutput: "55",

    testCases: {
      public: [{ input: "10", output: "55" }],
      hidden: [
        { input: "0", output: "0" },
        { input: "1", output: "1" },
      ],
    },
  },
  {
    title: "Climbing Stairs",
    description: "Find number of distinct ways to reach the top.",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    constraints: "1 ≤ N ≤ 45",

    functionName: "climbStairs",
    parameters: ["n"],
    returnType: "number",

    sampleInput: "3",
    sampleOutput: "3",

    testCases: {
      public: [{ input: "3", output: "3" }],
      hidden: [
        { input: "1", output: "1" },
        { input: "5", output: "8" },
      ],
    },
  },
  // linked List
  {
    title: "Reverse Linked List",
    description: "Reverse a singly linked list and return the new head.",
    topic: "Linked Lists",
    difficulty: "Easy",
    constraints: "0 ≤ N ≤ 10^5",

    functionName: "reverseList",
    parameters: ["head"],
    returnType: "list",

    sampleInput: "[1,2,3,4,5]",
    sampleOutput: "[5,4,3,2,1]",

    testCases: {
      public: [{ input: "[1,2,3]", output: "[3,2,1]" }],
      hidden: [
        { input: "[]", output: "[]" },
        { input: "[1]", output: "[1]" },
      ],
    },
  },
  // Trees/Graphs
  {
    title: "Maximum Depth of Binary Tree",
    description: "Return the maximum depth of a binary tree.",
    topic: "Trees & Graphs",
    difficulty: "Easy",
    constraints: "0 ≤ N ≤ 10^5",

    functionName: "maxDepth",
    parameters: ["root"],
    returnType: "number",

    sampleInput: "[3,9,20,null,null,15,7]",
    sampleOutput: "3",

    testCases: {
      public: [{ input: "[1,null,2]", output: "2" }],
      hidden: [
        { input: "[]", output: "0" },
        { input: "[1]", output: "1" },
      ],
    },
  },
  // Binary Search
  {
    title: "Binary Search",
    description: "Find the index of target in a sorted array, else return -1.",
    topic: "Binary Search",
    difficulty: "Easy",
    constraints: "1 ≤ N ≤ 10^5",

    functionName: "binarySearch",
    parameters: ["nums", "target"],
    paramTypes: ["int[]", "int"],
    returnType: "number",

    sampleInput: "[1,2,3,4,5]\n3",
    sampleOutput: "2",

    testCases: {
      public: [{ input: "[1,2,3,4,5]\n3", output: "2" }],
      hidden: [
        { input: "[1,2,3,4,5]\n6", output: "-1" },
        { input: "[5]\n5", output: "0" },
      ],
    },
  },

  // Sorting
  {
    title: "Sort an Array",
    description: "Sort an array in ascending order.",
    topic: "Sorting Algorithms",
    difficulty: "Easy",
    constraints: "1 ≤ N ≤ 10^5",

    functionName: "sortArray",
    parameters: ["nums"],
    returnType: "array",

    sampleInput: "[5,2,3,1]",
    sampleOutput: "[1,2,3,5]",

    testCases: {
      public: [{ input: "[3,1,2]", output: "[1,2,3]" }],
      hidden: [
        { input: "[5,4,3,2,1]", output: "[1,2,3,4,5]" },
        { input: "[1]", output: "[1]" },
      ],
    },
  },
];
try {
  await connectDb();
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log("Questions seeded successfully");
  process.exit();
} catch (error) {
  console.error("Seeding failed", error);
  process.exit(1);
}
