import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const fetchUserProfile = async () => {
  const { data } = await api.get("/user/profile");
  return data;
};

export const updateUserProfile = async (formData) => {
  const { data } = await api.put("/user/update", formData);
  return data;
};

export const requestPasswordReset = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPasswordWithToken = async ({ token, password }) => {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
};
