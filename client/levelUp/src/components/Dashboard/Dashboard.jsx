import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Added Framer Motion
// Lucide icons for both Navbar and Dashboard
import { Target, Award, Flame, Crown, PlayCircle, Trophy, User, LogOut, LayoutDashboard, Zap, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BanNotice from "../common/BanNotice";
import { fetchUserProfile } from "../../services/profileService";

// --- Animation Variants (Settings) ---
const topAnim = { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const leftAnim = { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } };
const rightAnim = { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } };
const bottomAnim = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } } };

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profileStats, setProfileStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchUserProfile();
        setProfileStats(data);
      } catch {
        setProfileStats(null);
      }
    };
    if (user) loadStats();
  }, [user]);

  const handleStartBattle = () => {
    if (!user) {
      navigate("/signin"); // not logged in → send to signin
    } else {
      navigate("/battle-setup"); // logged in → go straight to setup
    }
  };
  const winRate = profileStats?.winRate ?? (user?.totalBattles
    ? Math.round((user.totalWins / user.totalBattles) * 100)
    : 0);
  const globalRank = profileStats?.statsSummary?.find((s) => s.label === "Global Rank")?.value ?? "Unranked";
  const currentStreak = profileStats?.currentStreak ?? 0;
  const battleHistory = profileStats?.battleHistory ?? [];
  const topicMastery = profileStats?.topicMastery ?? [];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-6 pt-24 md:pt-28 pb-10 space-y-8">
        <BanNotice />

        {/* Top Welcome Banner - Top Animation */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={topAnim}
          className="rounded-3xl bg-linear-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] text-white px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-lg shadow-blue-500/20"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-white/80 mb-2">
              Welcome back
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
              {user?.username}
            </h1>
            <p className="text-sm md:text-base text-white/80">
              Ready to start your next coding battle?
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow"
          >
            {/* <PlayCircle className="w-5 h-5 text-[#2563eb]" /> */}
            {/* <span>Start New Battle</span> */}
            <button
              onClick={handleStartBattle}
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-2xl font-semibold text-sm"
            >
              <PlayCircle className="w-5 h-5 text-[#2563eb]" />
              Start New Battle
            </button>
          </motion.button>
        </motion.section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Left Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={leftAnim}
            className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 px-5 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Battles
              </p>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-white/5 text-indigo-500 dark:text-cyan-400">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{user?.totalBattles || 0}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={leftAnim}
            className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 px-5 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Win Rate
              </p>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-white/5 text-emerald-500 dark:text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{winRate}%</p>
          </motion.div>

          {/* Right Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={rightAnim}
            className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 px-5 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Current Streak
              </p>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-white/5 text-amber-500 dark:text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{currentStreak}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={rightAnim}
            className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 px-5 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Global Rank
              </p>
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-white/5 text-sky-500 dark:text-sky-400">
                <Crown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{globalRank}</p>
          </motion.div>
        </section>

        {/* --- NEW SECTION: RECOMMENDED BATTLE + MONTHLY PROGRESS START --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Recommended Challenge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 p-5 flex items-center gap-4"
          >
            <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-widest">
                Next Target
              </h3>
              <p className="text-sm text-amber-800/80 dark:text-amber-400/80 mt-1 font-medium">
                Master <span className="font-bold underline">Strings</span> to
                beat your rivals.
              </p>
            </div>
            <button className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-amber-600 transition-all active:scale-95">
              Start
            </button>
          </motion.div>

          {/* Right: GitHub Style Weekly Progress (1 Month) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Monthly Progress
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                MARCH
              </span>
            </div>
            <div className="flex gap-1.5 justify-center">
              {/* Generating 5 weeks for 1 month */}
              {Array.from({ length: 5 }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1.5">
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const level = Math.floor(Math.random() * 4);
                    return (
                      <div
                        key={dayIdx}
                        className={`w-3.5 h-3.5 rounded-sm ${
                          level === 0
                            ? "bg-slate-100 dark:bg-white/5"
                            : level === 1
                              ? "bg-emerald-500/30"
                              : level === 2
                                ? "bg-emerald-500/60"
                                : "bg-emerald-500"
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
              <div className="ml-4 flex flex-col justify-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-sm"></div>{" "}
                  Active
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-200 dark:bg-white/10 rounded-sm"></div>{" "}
                  Idle
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        {/* --- NEW SECTION END --- */}

        {/* Middle Grid: Quick Actions + Battle History */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - Left Animation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={leftAnim}
            className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 p-5 shadow-sm flex flex-col gap-4"
          >
            <div>
              <h2 className="text-base font-semibold mb-1">Quick Actions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your battle mode
              </p>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between rounded-2xl px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/30 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-500/20 transition-colors">
                <span>Easy Battle</span>
                <span className="text-xs opacity-80">Easy</span>
              </button>
              <button className="w-full flex items-center justify-between rounded-2xl px-4 py-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/30 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/80 dark:hover:bg-indigo-500/20 transition-colors">
                <span>Medium Battle</span>
                <span className="text-xs opacity-80">Medium</span>
              </button>
              <button className="w-full flex items-center justify-between rounded-2xl px-4 py-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/30 text-sm font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-100/80 dark:hover:bg-rose-500/20 transition-colors">
                <span>Hard Battle</span>
                <span className="text-xs opacity-80">Hard</span>
              </button>
            </div>
          </motion.div>

          {/* Battle History - Right Animation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={rightAnim}
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold mb-1">Battle History</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your recent coding duels
                </p>
              </div>
              <button className="text-xs font-medium text-[#2563eb] dark:text-cyan-400 hover:underline">
                View Full Analytics
              </button>
            </div>

            <div className="space-y-3">
              {battleHistory.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                  No battle history yet. Start your first battle!
                </p>
              )}
              {battleHistory.map((battle, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/5 px-4 py-3 bg-slate-50/60 dark:bg-white/5"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      vs {battle.opponent}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {battle.difficulty}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span
                      className={
                        "px-2.5 py-1 rounded-full font-semibold " +
                        (battle.result === "Won"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300")
                      }
                    >
                      {battle.result}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {battle.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Topic Mastery - Bottom Animation */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={bottomAnim}
          className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold mb-1">Topic Mastery</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your progress across DSA topics (Target: 10 Battles)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicMastery.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 col-span-2">
                Complete battles to track topic mastery.
              </p>
            )}
            {topicMastery.map((topic, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{topic.topic}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {topic.completed} battles · {topic.progress}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.progress}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-linear-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;
