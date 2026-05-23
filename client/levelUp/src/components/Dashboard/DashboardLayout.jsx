import React from "react";
import DashboardNavbar from "../layout/DashboardNavbar"; // Navbar ko import kiya

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-slate-100 font-sans">
      {/* Navbar hamesha top par rahega */}
      <DashboardNavbar />

      {/* 'children' wo content hai jo har page par alag hoga (Dashboard, Leaderboard, etc.) */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;