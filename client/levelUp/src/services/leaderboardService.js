import api from "./api.js";

export const fetchLeaderboard = async () => {
  const { data } = await api.get("/leaderboard");
  return data;
};

export const fetchTopLeaderboard = async (limit = 10) => {
  const { data } = await api.get(`/leaderboard/top/${limit}`);
  return data;
};

export const fetchMyRank = async () => {
  const { data } = await api.get("/leaderboard/me");
  return data;
};
