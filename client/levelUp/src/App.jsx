import ForgotPassword from "./components/auth/ForgetPassword";
import ResetPassword from "./components/auth/ResetPassword";

import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice/authSlice";

// Components
import CheckAuth from "./components/common/CheckAuth";
import MainLayout from "./components/layout/MainLayout"; // Layout Wrapper

import Home from "./components/Home/Home";
import Auth from "./components/auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";
import BattleSetup from "./components/Dashboard/BattleSetup";
import NotFound from "./pages/NotFound";
import BattlePage from "./pages/BattlePage";
import OpponentMatchIntro from "./components/battle/MatchIntro/OpponentMatchIntro";
import ProfilePage from "./components/layout/ProfilePage";

function App() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // On every app load, ask the server "is this user still valid?"
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Block rendering until we know the auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050816]">
        <div className="w-10 h-10 rounded-full border-4 border-[#7000ff] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Routes>
        {/* --- GROUP 1: In pages par Navbar/Footer DIKHEGA --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          
          <Route
            path="/dashboard"

            element={
              <CheckAuth isAuthenticated={isAuthenticated}>
                <Dashboard />
              </CheckAuth>
            }
          />
          {/* YE WALA LINE ADD KARO */}
          <Route
            path="/profile"
            element={
              <CheckAuth isAuthenticated={isAuthenticated}>
                <ProfilePage />
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
        </Route>

        {/* --- GROUP 2: In pages par Navbar/Footer NAHI dikhega --- */}
        {/* Forgot & Reset Password Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Signin Page */}
        <Route
          path="/signin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <Auth />
            </CheckAuth>
          }
        />

        {/* Challenge Page */}
        <Route 
          path="/challenge/:battleId" 
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <OpponentMatchIntro />
            </CheckAuth>
          } 
        />

        {/* Battle Arena Screen */}
        <Route 
          path="/battle/:battleId" 
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <BattlePage />
            </CheckAuth>
          } 
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}


export default App;
