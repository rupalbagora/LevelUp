
import axios from "axios";

const PISTON_URL = "http://localhost:2000/api/v2/execute";

export async function executeCode({ language, code, input = "" }) {
  try {
    const response = await axios.post(PISTON_URL, {
      language: language,
      version: getVersion(language), 
      files: [
        {
          content: code,
        },
      ],
      stdin: input,
    });

    return {
      output: response.data.run.output?.trim(),
      stderr: response.data.run.stderr,
      success: response.data.run.code === 0,
    };
  } catch (error) {
    console.error("PISTON ERROR:", error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

// 🔥 helper function
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