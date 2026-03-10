// import React from 'react'
// import Navbar from './components/layout/Navbar';
// import Home from './components/Home/Home';
// import {Routes,Route} from "react-router-dom"
// import Auth from './components/auth/Auth';
// import DashboardLayout from './components/Dashboard/DashboardLayout';
// const App = () => {
//   return (
//     <div className="bg-gray-50">
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/signin" element={<Auth />} />
//         <Route path="/dashboard" element={<DashboardLayout />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;


import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice/authSlice";

import Navbar from "./components/layout/Navbar";
import CheckAuth from "./components/common/CheckAuth";

import Home from "./components/Home/Home";
import Auth from "./components/auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import BattleSetup from "./components/Dashboard/BattleSetup";
import NotFound from "./pages/NotFound";
import Footer from "./components/layout/Footer";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // On every app load, ask the server "is this user still valid?"
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Block rendering until we know the auth state
  // Prevents flash of wrong page (e.g. showing /dashboard then redirecting)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050816]">
        <div className="w-10 h-10 rounded-full border-4 border-[#7000ff] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public — no guard needed */}
        <Route path="/" element={<Home />} />

        {/* Auth pages — redirect to /dashboard if already logged in */}
        <Route
          path="/signin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <Auth />
            </CheckAuth>
          }
        />

        {/* Protected pages — redirect to /signin if not logged in */}
        <Route
          path="/dashboard"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              {/* <DashboardLayout> */}
                <Dashboard />
              {/* </DashboardLayout> */}
            </CheckAuth>
          }
        />

        <Route
          path="/battle-setup"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <BattleSetup />
            </CheckAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;