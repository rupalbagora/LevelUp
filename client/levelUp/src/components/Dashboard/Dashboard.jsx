import React from "react";
import Navbar from "../layout/Navbar";
import { Target, Award, Flame, Crown, PlayCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Top Welcome Banner */}
        <section className="rounded-3xl bg-linear-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] text-white px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-lg shadow-blue-500/20">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-white/80 mb-2">
              Welcome back
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
              nehaprajapati140!
            </h1>
            <p className="text-sm md:text-base text-white/80">
              Ready to start your next coding battle?
            </p>
          </div>
          <button className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow">
            <PlayCircle className="w-5 h-5 text-[#2563eb]" />
            <span>Start New Battle</span>
          </button>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Battles
              </p>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-white/5 text-indigo-500 dark:text-cyan-400">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">47</p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Win Rate
              </p>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-white/5 text-emerald-500 dark:text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">68%</p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Current Streak
              </p>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-white/5 text-amber-500 dark:text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">5</p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Global Rank
              </p>
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-white/5 text-sky-500 dark:text-sky-400">
                <Crown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">#342</p>
          </div>
        </section>

        {/* Middle Grid: Quick Actions + Battle History */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 p-5 shadow-sm flex flex-col gap-4">
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
          </div>

          {/* Battle History */}
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 p-5 shadow-sm flex flex-col gap-4">
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
              {[
                { opponent: "CodeNinja92", result: "Won", time: "2m 45s", difficulty: "Binary Search · Medium" },
                { opponent: "AlgoMaster", result: "Lost", time: "5m 12s", difficulty: "Dynamic Programming · Hard" },
                { opponent: "DevWarrior", result: "Won", time: "3m 30s", difficulty: "Arrays · Easy" },
              ].map((battle, idx) => (
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
          </div>
        </section>

        {/* Topic Mastery */}
        <section className="rounded-2xl bg-white dark:bg-[#060910] border border-slate-200/70 dark:border-white/5 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold mb-1">Topic Mastery</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your progress across DSA topics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Arrays & Strings", value: "12 battles", width: "w-10/12" },
              { label: "Binary Search", value: "8 battles", width: "w-8/12" },
              { label: "Dynamic Programming", value: "5 battles", width: "w-4/12" },
              { label: "Trees & Graphs", value: "9 battles", width: "w-7/12" },
            ].map((topic, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{topic.label}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {topic.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${topic.width} bg-linear-to-r from-[#2563eb] via-[#4f46e5] to-[#7c3aed] rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

