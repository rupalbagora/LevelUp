import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/battle`;

export const reportCheatAPI = async (battleId, reason) => {
  const response = await axios.post(
    `${API_URL}/${battleId}/report-cheat`,
    { reason },
    { withCredentials: true },
  );

  return response.data;
};
