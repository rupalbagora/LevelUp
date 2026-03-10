// import React, { useState, useEffect } from "react";

// import { Swords, Sun, Moon, Menu, X } from "lucide-react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const [darkMode, setDarkMode] = useState(true);

//   useEffect(() => {
//     if (darkMode) document.documentElement.classList.add('dark');
//     else document.documentElement.classList.remove('dark');
//   }, [darkMode]);

//   return (
//     <nav className="w-full glass-nav sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//         <Link to="/" className="flex items-center gap-2 group">
//           <div className="p-2.5 bg-[#7000ff] rounded-xl shadow-lg shadow-purple-500/20">
//             <Swords className="text-white w-6 h-6" />
//           </div>
//           <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
//             Level{" "}
//             <span className="text-[#7000ff] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#00d4ff] dark:to-blue-400">
//               Up
//             </span>
//           </span>
//         </Link>

//         <div className="flex items-center gap-6">
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
//           >
//             {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//           <Link to="/signin" className="hidden sm:block btn-primary">
//             Join Arena
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };
// export default Navbar;

import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth-slice/authSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  Swords,
  Sun,
  Moon,
  Trophy,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth); // ← read from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className="w-full glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
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

        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            // ✅ LOGGED IN — show nav links + logout
            <>
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#2563eb] dark:hover:text-cyan-400 transition-colors"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <Link
                to="/leaderboard"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#2563eb] dark:hover:text-cyan-400 transition-colors"
              >
                <Trophy size={16} /> Leaderboard
              </Link>

              <Link
                to="/settings"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              >
                <Settings size={18} />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all border border-rose-100 dark:border-white/5"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            // ❌ LOGGED OUT — show Join Arena
            <Link to="/signin" className="btn-primary">
              Join Arena
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;