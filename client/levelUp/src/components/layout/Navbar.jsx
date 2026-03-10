import React, { useState, useEffect } from "react";
import { Swords, Sun, Moon, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true); 

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <nav className="w-full glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2.5 bg-[#7000ff] rounded-xl shadow-lg shadow-purple-500/20">
            <Swords className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Level{" "}
            <span className="text-[#7000ff] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#00d4ff] dark:to-blue-400">
              Up
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/signin" className="hidden sm:block btn-primary">
            Join Arena
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;