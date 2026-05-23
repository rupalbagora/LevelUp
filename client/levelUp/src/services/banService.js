import axios from "axios";

export const getBanStatusAPI = async () => {
  const response = await axios.get("http://localhost:5000/api/auth/ban-status", {
    withCredentials: true,
  });

  return response.data;
};
