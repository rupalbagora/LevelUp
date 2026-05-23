import React from "react";
import { Trophy, User, LogOut, LayoutDashboard } from "lucide-react";

const DashboardNavbar = () => {
  return (
    <nav className="border-b border-slate-200/70 dark:border-white/5 bg-white/80 dark:bg-[#050816]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo - Matches your Banner Gradient */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            LevelUp
          </span>
        </div>

        {/* Links - Leaderboard & Profile */}
        <div className="hidden md:flex items-center gap-8">
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#2563eb] dark:hover:text-cyan-400 transition-colors">
            <Trophy className="w-4 h-4" />
            Leaderboard
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#2563eb] dark:hover:text-cyan-400 transition-colors">
            <User className="w-4 h-4" />
            Profile
          </button>
        </div>

        {/* Logout - Red Accent */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-100 dark:border-white/5">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;