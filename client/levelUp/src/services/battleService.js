import axios from "axios";

const API_URL = "http://localhost:5000/api/battle"; 

// 1. Create Battle
export const createBattleAPI = async (topic, difficulty) => {
  try {
    const response = await axios.post(`${API_URL}/create`, 
      { topic, difficulty }, 
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Battle API Error:", error);
    throw error;
  }
};

// 2. Join/Status Check (Fixed URL)
export const joinBattleAPI = async (battleId) => {
  try {
    
    const response = await axios.post(`${API_URL}/join/${battleId}`, {}, {
      withCredentials: true, // Ye bhi add kar lo taaki session bana rahe
      
      validateStatus: function (status) {
        return status >= 200 && status < 500; 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Actual Error in joinBattleAPI:", error);
    throw error;
  }
};
// battleService.js
export const getBattleQuestion = async (battleId) => {
  const response = await axios.get(
    `http://localhost:5000/api/battle/${battleId}/question`,
    { withCredentials: true }
  );
  return response.data;
};

export const runCodeAPI = async (battleId, code, language, input) => {
  const res = await axios.post(
    `http://localhost:5000/api/battle/${battleId}/run`,
    { code, language, input },
    { withCredentials: true },
  );
  return res.data;
};


// export const getBattleQuestion = async (battleId) => {
//   const token = localStorage.getItem("token");
//   const res = await fetch(`/api/battle/${battleId}/question`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) throw new Error("Failed to fetch question");
//   return res.json();
// };
// export const acceptBattleAPI = async (battleId) => {
//   const response = await axios.post(`${API_URL}/accept/${battleId}`, {}, { withCredentials: true });
//   return response.data;
// };

// // 3. Terminate Battle
// export const terminateBattleAPI = async (battleId) => {
//   try {
//     const response = await axios.post(`${API_URL}/terminate/${battleId}`, {}, { withCredentials: true });
//     return response.data;
//   } catch (error) {
//     console.error("Terminate Error:", error);
//     throw error;
//   }
// };