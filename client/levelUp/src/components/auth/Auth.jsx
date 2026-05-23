<<<<<<< HEAD
// import { useState } from "react";
// import RegisterForm from "./RegisterForm";
// import LoginForm from "./LoginForm";
// import BackButton from "../common/BackButton";
// import { Swords } from "lucide-react";
// const Auth = () => {
//   const [activeTab, setActiveTab] = useState("signin");

//   return (
//     <div className="bg-gray-50">
//       <BackButton/>
//       <div className="min-h-screen flex items-center justify-center ">
//         <div className="w-full max-w-md rounded-xl  p-6">
//           {/* Logo & Title */}
//           <div className="text-center mb-6">
//             <div className="flex justify-center gap-3 cursor-pointer mb-6">
//               <div className="p-2 bg-blue-600 rounded-md">
//                 <Swords className="text-white w-5 h-5 sm:w-6 sm:h-6" />
//               </div>
//               <span className="text-xl sm:text-2xl font-bold text-black">
//                 Level Up
//               </span>
//             </div>
//             {/* <h1 className="text-2xl font-bold mt-3">Level Up</h1> */}
//             <p className="text-gray-600 text-2sm">
//               Join the coding battle arena
//             </p>
//           </div>

//           {/* Tabs */}
//           <div className="flex bg-gray-100 rounded-full p-1 mb-6">
//             <button
//               onClick={() => setActiveTab("signin")}
//               className={`w-1/2 py-2 rounded-full text-sm font-semibold
//     transition-all duration-300 ease-in-out ${
//       activeTab === "signin"
//         ? "bg-white shadow-md text-blue-600 scale-100"
//         : "text-gray-500 scale-95"
//     }`}
//             >
//               Sign In
//             </button>

//             <button
//               onClick={() => setActiveTab("signup")}
//               className={`w-1/2 py-2 rounded-full text-sm font-semibold
//     transition-all duration-300 ease-in-out ${
//       activeTab === "signup"
//         ? "bg-white shadow-md text-blue-600 scale-100"
//         : "text-gray-500 scale-95"
//     }`}
//             >
//               Sign Up
//             </button>
//           </div>

//           {/* Forms */}
//           {activeTab === "signin" ? <LoginForm /> : <RegisterForm />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;
=======
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import BackButton from "../common/BackButton";
import { Swords } from "lucide-react";
import { motion } from "framer-motion";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#050816]">
      {/* Animated Gradient Glow */}
      <div
        className="
      absolute top-1/2 left-1/2
      w-[900px] h-[600px]
      -translate-x-1/2 -translate-y-1/2
      bg-[radial-gradient(circle,_rgba(112,0,255,0.35)_0%,_rgba(0,212,255,0.15)_40%,transparent_70%)]
      blur-[120px]
      opacity-70
      pointer-events-none
      "
      />

      {/* Floating Glow Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>

      {/* Rings (Arena style) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none opacity-40">
        <svg viewBox="0 0 1000 500" className="w-[900px]">
          <circle
            cx="500"
            cy="500"
            r="200"
            stroke="currentColor"
            className="text-gray-400 dark:text-white/10"
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 6"
          />
          <circle
            cx="500"
            cy="500"
            r="300"
            stroke="currentColor"
            className="text-gray-400 dark:text-white/10"
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 6"
          />
          <circle
            cx="500"
            cy="500"
            r="400"
            stroke="currentColor"
            className="text-gray-500 dark:text-white/20"
            strokeWidth="1"
            fill="none"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      {/* Stars */}
      <motion.img
        src="https://cdn.prod.website-files.com/67bc0582a9859fa021751c94/6874990bd18cf6ec4041ae6b_stars.svg"
        alt="stars"
        animate={{ x: [0, 20, -20, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-50 pointer-events-none"
      />

      <BackButton />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="
        relative z-10
        w-full max-w-md
        rounded-3xl
        border border-slate-200 dark:border-white/10
        bg-white/80 dark:bg-[#0b0f1f]/90
        backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        p-8
      "
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <div
              className="
            p-3
            bg-gradient-to-r
            from-[#7000ff]
            to-[#00d4ff]
            rounded-xl
            shadow-lg
            "
            >
              <Swords className="text-white w-6 h-6" />
            </div>

            <span className="text-2xl font-black text-slate-900 dark:text-white">
              LevelUp
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Enter the coding battle arena ⚔️
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 dark:bg-white/5 rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all
            ${
              activeTab === "signin"
                ? "bg-white dark:bg-[#0D1117] shadow text-[#7000ff]"
                : "text-slate-500"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all
            ${
              activeTab === "signup"
                ? "bg-white dark:bg-[#0D1117] shadow text-[#7000ff]"
                : "text-slate-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "signin" ? <LoginForm /> : <RegisterForm />}
      </motion.div>
    </section>
  );
};

export default Auth;