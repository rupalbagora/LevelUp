import axios from "axios";

<<<<<<< HEAD
const API_URL = "http://localhost:5000/api/battle"; // Apna backend URL check kar lena
=======
const API_URL = `${import.meta.env.VITE_API_URL}/api/battle`; // Apna backend URL check kar lena
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09

export const fetchAIHint = async (battleId, currentCode, problemStatement, type) => {
  const response = await axios.post(
    `${API_URL}/${battleId}/hint`,
    { battleId, currentCode, problemStatement, type },
    { withCredentials: true },
  );
  return response.data;
};