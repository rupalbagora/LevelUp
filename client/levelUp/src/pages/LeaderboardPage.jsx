import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import {
  AlertCircle,
  Award,
  Crown,
  Medal,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Flame
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  fetchLeaderboard,
  fetchMyRank,
} from "../services/leaderboardService";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const getRankColors = (rank) => {
  if (rank === 1) return {
    bg: "bg-amber-100 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-300 dark:border-amber-500/40",
    glow: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]"
  };
  if (rank === 2) return {
    bg: "bg-slate-100 dark:bg-slate-400/20",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-400/40",
    glow: "shadow-[0_0_30px_-5px_rgba(148,163,184,0.3)]"
  };
  if (rank === 3) return {
    bg: "bg-orange-100 dark:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-300 dark:border-orange-500/40",
    glow: "shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]"
  };
  return {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/20",
    glow: ""
  };
};

const getInitials = (name = "Player") =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const formatRank = (rank) => (rank ? `#${rank}` : "Unranked");

const LeaderboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const isMountedRef = useRef(true);
  const requestInFlightRef = useRef(false);

  const loadLeaderboard = useCallback(async (isRefresh = false) => {
    if (requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const [leaderboardData, myRankData] = await Promise.all([
        fetchLeaderboard(),
        fetchMyRank(),
      ]);

      if (!isMountedRef.current) return;

      setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
      setMyRank(myRankData);
      setLastSyncedAt(new Date());
    } catch (err) {
      if (!isMountedRef.current) return;

      setError(
        err.response?.data?.message ||
          "Leaderboard is not available right now. Please try again.",
      );
    } finally {
      requestInFlightRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true; // FIX: Ensure ref is true on mount for Strict Mode
    loadLeaderboard();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadLeaderboard]);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL;
    if (!socketUrl) return undefined;

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      if (isMountedRef.current) setIsLive(true);
    });

    socket.on("disconnect", () => {
      if (isMountedRef.current) setIsLive(false);
    });

    socket.on("leaderboard:updated", async (payload) => {
      if (!isMountedRef.current) return;

      if (Array.isArray(payload?.leaderboard)) {
        setLeaderboard(payload.leaderboard);
        setLastSyncedAt(new Date(payload.updatedAt || Date.now()));
        setError("");
        try {
          const myRankData = await fetchMyRank();
          if (isMountedRef.current) setMyRank(myRankData);
        } catch {
          // keep existing myRank
        }
      } else {
        loadLeaderboard(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [loadLeaderboard]);

  const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const rankedPlayers = useMemo(() => leaderboard, [leaderboard]);
  const totalPlayers = leaderboard.length;
  const totalBattles = leaderboard.reduce((sum, p) => sum + (p.totalBattles || 0), 0);
  const totalWins = leaderboard.reduce((sum, p) => sum + (p.totalWins || 0), 0);

  const currentUsername = user?.username;
  const lastSyncedLabel = lastSyncedAt
    ? lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "Syncing";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#030712] text-slate-900 dark:text-slate-100 pt-24 pb-12 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-500/20 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0a0f1c]/50 backdrop-blur-xl shadow-xl"
        >
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-8 py-10 md:py-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <Trophy className="w-96 h-96" />
            </div>
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8 z-10">
              <div className="space-y-4 max-w-2xl">
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-inner border border-white/10">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    Global Rankings
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest border ${
                      isLive
                        ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30"
                        : "bg-white/10 text-white/70 border-white/10"
                    }`}
                  >
                    <Radio className={`w-4 h-4 ${isLive ? "animate-pulse text-emerald-400" : ""}`} />
                    {isLive ? "Live Feed" : "Connecting..."}
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Champions</span>
                  </h1>
                  <p className="mt-3 text-base md:text-lg text-white/80 font-medium leading-relaxed max-w-xl">
                    Compete in battles, earn points, and solidify your legacy. The top ranks await true warriors.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadLeaderboard(true)}
                disabled={refreshing}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-4 text-sm font-bold shadow-2xl disabled:opacity-70 transition-all duration-300 w-full md:w-auto"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                {refreshing ? "Syncing..." : "Refresh Rankings"}
              </motion.button>
            </div>
            <p className="mt-8 text-xs font-bold text-white/60 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-white/40"></span>
              Last updated: {lastSyncedLabel}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-slate-200/50 dark:border-white/5 divide-y md:divide-y-0 md:divide-x divide-slate-200/50 dark:divide-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-md">
            <div className="p-8 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Your Rank</p>
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-500">
                {formatRank(myRank?.rankPosition)}
              </p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Score: {myRank?.score ?? 0}
              </p>
            </div>
            <div className="p-8 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Active Players</p>
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-4xl font-black text-slate-800 dark:text-white">{totalPlayers}</p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">Ranked competitors globally</p>
            </div>
            <div className="p-8 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Total Battles</p>
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-4xl font-black text-slate-800 dark:text-white">{totalBattles}</p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">{totalWins} total victories claimed</p>
            </div>
          </div>
        </motion.section>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse uppercase tracking-widest">Loading Rankings</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/10 p-16 text-center shadow-xl">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shadow-inner">
              <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">The arena is empty</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Be the first to step into the arena. Complete a battle and claim the number one spot instantly!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8 px-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white">Elite Contenders</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-end h-auto lg:h-[340px] pb-4">
                  {/* Reorder array for podium display: Rank 2, Rank 1, Rank 3 on large screens */}
                  {[
                    topThree[1],
                    topThree[0],
                    topThree[2]
                  ].filter(Boolean).map((player) => {
                    const rank = player.rankPosition;
                    const colors = getRankColors(rank);
                    const isFirst = rank === 1;
                    const isCurrentUser = player.username === currentUsername;
                    
                    return (
                      <motion.div
                        key={`${player.username}-${rank}`}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rank * 0.1, duration: 0.6, type: "spring", bounce: 0.4 }}
                        className={`relative rounded-3xl border p-7 ${colors.bg} ${colors.border} ${colors.glow} backdrop-blur-xl hover:-translate-y-2 transition-transform duration-300 ${
                          isFirst ? "lg:h-[110%] z-10 shadow-2xl" : "lg:h-full opacity-90 hover:opacity-100"
                        }`}
                      >
                        {isFirst && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <div className="relative">
                              <div className="absolute inset-0 bg-amber-400 blur-xl opacity-50 rounded-full animate-pulse" />
                              <Crown className="w-12 h-12 text-amber-500 relative z-10 drop-shadow-lg" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-col items-center text-center mt-2">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shadow-inner mb-4 border-4 border-white/50 dark:border-black/20 ${colors.bg} ${colors.text}`}>
                            #{rank}
                          </div>
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white truncate w-full px-2">
                            {player.username}
                          </h3>
                          {isCurrentUser && (
                            <span className="mt-2 inline-block px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                              You
                            </span>
                          )}
                        </div>

                        <div className="mt-8 space-y-4">
                          <div className="bg-white/60 dark:bg-black/20 rounded-2xl p-4 border border-white/40 dark:border-white/5 backdrop-blur-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-1">Score</p>
                            <p className={`text-3xl font-black text-center ${colors.text}`}>{player.score}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/40 dark:bg-black/10 rounded-xl p-3 text-center border border-white/40 dark:border-white/5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Wins</p>
                              <p className="text-lg font-black text-slate-800 dark:text-white">{player.totalWins}</p>
                            </div>
                            <div className="bg-white/40 dark:bg-black/10 rounded-xl p-3 text-center border border-white/40 dark:border-white/5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Battles</p>
                              <p className="text-lg font-black text-slate-800 dark:text-white">{player.totalBattles}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* All Players List */}
            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <Medal className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white">Global Standings</h2>
                </div>
                <p className="text-sm font-semibold text-slate-500 hidden sm:block">Ranked by total score</p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="rounded-[2rem] bg-white dark:bg-[#0a0f1c] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden"
              >
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-[80px_1fr_150px_150px_150px] gap-4 px-8 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] text-xs font-bold uppercase tracking-widest text-slate-500">
                  <div className="text-center">Rank</div>
                  <div>Player</div>
                  <div className="text-right">Score</div>
                  <div className="text-center">Wins</div>
                  <div className="text-center">Win Rate</div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  <AnimatePresence>
                    {rankedPlayers.map((player, index) => {
                      const rank = player.rankPosition || index + 1;
                      const winRate = player.totalBattles
                        ? Math.round((player.totalWins / player.totalBattles) * 100)
                        : 0;
                      const isCurrentUser = player.username === currentUsername;
                      const isTop3 = rank <= 3;

                      return (
                        <motion.div
                          key={`${player.username}-${rank}`}
                          variants={fadeUp}
                          className={`group relative flex flex-col lg:grid lg:grid-cols-[80px_1fr_150px_150px_150px] gap-4 lg:gap-4 items-center px-6 lg:px-8 py-5 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/[0.02] ${
                            isCurrentUser ? "bg-blue-50/50 dark:bg-blue-500/5" : ""
                          }`}
                        >
                          {isCurrentUser && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                          )}
                          
                          <div className="flex w-full lg:w-auto items-center justify-between lg:justify-center">
                            <div className="lg:hidden text-xs font-bold uppercase tracking-widest text-slate-500">Rank</div>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                              isTop3 
                                ? getRankColors(rank).bg + " " + getRankColors(rank).text
                                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
                            }`}>
                              #{rank}
                            </div>
                          </div>

                          <div className="w-full lg:w-auto flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-300 text-white dark:text-slate-900 flex items-center justify-center text-sm font-black shadow-md border-2 border-white dark:border-slate-800 group-hover:scale-110 transition-transform">
                              {getInitials(player.username)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-base text-slate-900 dark:text-white truncate">
                                {player.username}
                              </p>
                              <p className="text-xs font-medium text-slate-500">
                                {isCurrentUser ? "Your Profile" : "Level Up Player"}
                              </p>
                            </div>
                          </div>

                          <div className="w-full lg:w-auto flex justify-between lg:justify-end items-center text-sm font-black text-slate-800 dark:text-white">
                            <span className="lg:hidden text-xs uppercase tracking-widest text-slate-500 font-bold">Score</span>
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg">
                              <Award className="w-4 h-4 text-amber-500" />
                              {player.score || 0}
                            </div>
                          </div>

                          <div className="w-full lg:w-auto flex justify-between lg:justify-center items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                            <span className="lg:hidden text-xs uppercase tracking-widest text-slate-500 font-bold">Wins</span>
                            <span className="bg-slate-50 dark:bg-white/[0.02] px-4 py-1.5 rounded-lg border border-slate-100 dark:border-white/5">{player.totalWins || 0}</span>
                          </div>

                          <div className="w-full lg:w-auto flex justify-between lg:justify-center items-center">
                            <span className="lg:hidden text-xs uppercase tracking-widest text-slate-500 font-bold">Win Rate</span>
                            <div className="w-full lg:w-24">
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span>{winRate}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${winRate}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className={`h-full rounded-full ${
                                    winRate > 60 ? "bg-emerald-500" : winRate > 40 ? "bg-amber-500" : "bg-rose-500"
                                  }`} 
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaderboardPage;
