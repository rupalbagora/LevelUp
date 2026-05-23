// import axios from "axios";

// const PISTON_URL = "http://localhost:2000/api/v2/execute";
// function generateWrapper(code, question) {
//   const { functionName, parameters } = question;

//   const paramParsing = parameters
//     .map((param, index) => {
//       return `const ${param} = JSON.parse(inputs[${index}]);`;
//     })
//     .join("\n");

//   const paramCall = parameters.join(", ");

//   return `
// ${code}

// // read input
// const raw = require("fs").readFileSync(0, "utf-8").trim();
// const inputs = raw.split("\\n");

// // parse parameters
// ${paramParsing}

// // call function
// const result = ${functionName}(${paramCall});

// // print output
// console.log(JSON.stringify(result));
// `;
// }
// export async function executeCode({ language, code, input, question }) {
//   try {
//     const wrappedCode = generateWrapper(code, question);
//     const response = await axios.post(PISTON_URL, {
//       language: language,
//       version: getVersion(language),
//       files: [
//         {
//           content: wrappedCode,
//         },
//       ],
//       stdin: input,
//     });

//     return {
//       output: response.data.run.output?.trim(),
//       stderr: response.data.run.stderr,
//       success: response.data.run.code === 0,
//       runtime: response.data.run.time || 0,
//       memory: response.data.run.memory || 0,
//     };
//   } catch (error) {
//     console.error("PISTON ERROR:", error.response?.data || error.message);

//     return {
//       success: false,
//       error: error.response?.data || error.message,
//     };
//   }
// }

// // 🔥 helper function
// function getVersion(language) {
//   const map = {
//     python: "3.10.0",
//     javascript: "18.15.0",
//     java: "15.0.2",
//   };
//   if (!map[language]) {
//     throw new Error("Unsupported language");
//   }
//   return map[language];
// }

import axios from "axios";
import { generateWrapper, validateFunction } from "./wrapperGenerator.js";

<<<<<<< HEAD
const PISTON_URL = "http://localhost:2000/api/v2/execute";
=======
// const PISTON_URL = "http://localhost:2000/api/v2/execute";
const PISTON_URL = process.env.PISTON_URL;
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09

export async function executeCode({ language, code, input, question }) {
  try {
    // ✅ 1. Validate function
    if (!validateFunction(code, question, language)) {
      return {
        success: false,
        error: `Function name should be "${question.functionName}"`,
      };
    }

    // ✅ 2. Wrap code
    const wrappedCode = generateWrapper(code, question, language);

    // ✅ 3. Send to Piston
    const response = await axios.post(PISTON_URL, {
      language,
      version: getVersion(language),
      files: [{ content: wrappedCode }],
      stdin: input,
    });

    return {
      output: response.data.run.output?.trim(),
      stderr: response.data.run.stderr,
      success: response.data.run.code === 0,
      runtime: response.data.run.time || 0,
      memory: response.data.run.memory || 0,
    };
  } catch (error) {
    console.error("PISTON ERROR:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

// ================= LANGUAGE VERSION =================
function getVersion(language) {
  const map = {
    python: "3.10.0",
    javascript: "18.15.0",
    java: "15.0.2",
  };

  if (!map[language]) {
    throw new Error("Unsupported language");
  }

  return map[language];
}