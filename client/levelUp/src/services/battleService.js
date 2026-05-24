import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/battle`; 
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// 1. Create Battle
export const createBattleAPI = async (topic, difficulty) => {
  const response = await axios.post(`${API_URL}/create`, { topic, difficulty }, getAuthHeaders(), { withCredentials: true });
  return response.data;
};

// 2. Join/Status Check
export const joinBattleAPI = async (battleId) => {
  const response = await axios.post(`${API_URL}/join/${battleId}`, {}, getAuthHeaders(), { withCredentials: true });
  return response.data;
};

// 3. Accept Battle (YE WALA EXPORT ZAROORI HAI)
export const acceptBattleAPI = async (battleId) => {
  const response = await axios.post(`${API_URL}/accept/${battleId}`, {},  getAuthHeaders(),{ withCredentials: true });
  return response.data;
};

// 4. Get Question
export const getBattleQuestion = async (battleId) => {
  const response = await axios.get(`${API_URL}/${battleId}/question`,  getAuthHeaders(), { withCredentials: true });
  return response.data;
};

// 5. Run Code
export const runCodeAPI = async (battleId, code, language, input) => {
  const res = await axios.post(`${API_URL}/${battleId}/run`, { code, language, input },  getAuthHeaders(),{ withCredentials: true });
  return res.data;
};

// 6. Terminate Battle
export const terminateBattleAPI = async (battleId) => {
  const response = await axios.post(`${API_URL}/terminate/${battleId}`, {}, getAuthHeaders(), { withCredentials: true });
  return response.data;
};
