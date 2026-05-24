import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/battle`; // Apna backend URL check kar lena

export const fetchAIHint = async (battleId, currentCode, problemStatement, type) => {
  const response = await axios.post(
    `${API_URL}/${battleId}/hint`,
    { battleId, currentCode, problemStatement, type },
    { withCredentials: true },
  );
  return response.data;
};