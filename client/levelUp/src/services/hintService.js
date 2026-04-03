import axios from "axios";

const API_URL = "http://localhost:5000/api/battle"; // Apna backend URL check kar lena

export const fetchAIHint = async (battleId, currentCode, problemStatement, type) => {
  const response = await axios.post(`${API_URL}/get-hint`, 
    { battleId, currentCode, problemStatement, type },
    { withCredentials: true }
  );
  return response.data;
};