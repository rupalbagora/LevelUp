import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import BackButton from "../common/BackButton";
import { Swords } from "lucide-react";
const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div className="bg-gray-50">
      <BackButton/>
      <div className="min-h-screen flex items-center justify-center ">
        <div className="w-full max-w-md rounded-xl  p-6">
          {/* Logo & Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center gap-3 cursor-pointer mb-6">
              <div className="p-2 bg-blue-600 rounded-md">
                <Swords className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-black">
                Level Up
              </span>
            </div>
            {/* <h1 className="text-2xl font-bold mt-3">Level Up</h1> */}
            <p className="text-gray-600 text-2sm">
              Join the coding battle arena
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button
              onClick={() => setActiveTab("signin")}
              className={`w-1/2 py-2 rounded-full text-sm font-semibold 
    transition-all duration-300 ease-in-out ${
      activeTab === "signin"
        ? "bg-white shadow-md text-blue-600 scale-100"
        : "text-gray-500 scale-95"
    }`}
            >
              Sign In
            </button>

            <button
              onClick={() => setActiveTab("signup")}
              className={`w-1/2 py-2 rounded-full text-sm font-semibold 
    transition-all duration-300 ease-in-out ${
      activeTab === "signup"
        ? "bg-white shadow-md text-blue-600 scale-100"
        : "text-gray-500 scale-95"
    }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {activeTab === "signin" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
