// import axios from "axios";
// const API_URL = `${import.meta.env.VITE_API_URL}/api`;
// export const getBanStatusAPI = async () => {
//   const response = await axios.get(`${API_URL}/auth/ban-status`, {
//     withCredentials: true,
//   });

//   return response.data;
// };

import api from "./api.js";

export const getBanStatusAPI = async () => {
  const { data } = await api.get("/auth/ban-status");

  return data;
};