import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { Swords } from "lucide-react";
const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        {/* Logo & Title */}
        <div className="text-center mb-6">
         <div className="flex items-center gap-2 cursor-pointer">
                   <div className="p-2 bg-blue-600 rounded-md">
                     <Swords className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          
                   </div>
                   <span className="text-xl sm:text-2xl font-bold text-blue-900">
                     Level Up
                   </span>
                 </div>
          {/* <h1 className="text-2xl font-bold mt-3">Level Up</h1> */}
          <p className="text-gray-500 text-sm">Join the coding battle arena</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("signin")}
            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
              activeTab === "signin"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setActiveTab("signup")}
            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
              activeTab === "signup"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {activeTab === "signin" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default Auth;
