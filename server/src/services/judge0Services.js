import axios from "axios";

export const runOnJudge0 = async ({ sourceCode, stdin }) => {
  const response = await axios.post(
    `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      source_code: sourceCode,
      language_id: 63, // JavaScript
      stdin,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        "X-RapidAPI-Host": process.env.JUDGE0_HOST,
      },
    },
  );

  return response.data;
};
