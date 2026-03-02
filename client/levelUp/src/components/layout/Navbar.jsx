import React from "react";
import { Swords } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [isLoggedIn,setIsLoggedIn]= useState(false);
  return (
    <nav className="w-full bg-white border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="p-2 bg-blue-600 rounded-md">
            <Swords className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-blue-900">
            Level Up
          </span>
        </div>

        {/* Right: Auth */}
        {!isLoggedIn ? (
          // Not Logged In

          <Link to="/signin" className="px-4 py-2 text-sm sm:text-base text-blue-600 font-semibold rounded-md hover:bg-blue-50 hover:text-blue-800 transition">
            Sign In
          </Link>
        ) : (
          // Logged In
          <div className="flex items-center gap-4">
            <Link to="dashboard" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 transition">
              Dashboard
            </Link>

            <Link to="leaderboard" className="text-sm sm:text-base text-gray-700 hover:text-blue-600 transition">
              Leaderboard
            </Link>

            <Link to="logout"
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 text-sm sm:text-base text-red-600 font-semibold rounded-md hover:bg-red-50 transition"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
