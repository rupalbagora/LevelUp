// import axios from "axios";

// export const API_BASE = import.meta.env.VITE_API_URL || "";

// const api = axios.create({
//   baseURL: `${API_BASE}/api`,
//   withCredentials: true,
// });

// export default api;
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

// Add token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Cache-Control"] =
      "no-store, no-cache, must-revalidate, proxy-revalidate";

    config.headers.Expires = "0";

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;