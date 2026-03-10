// import { Navigate, useNavigate } from "react-router-dom";
// import { Mail } from "lucide-react";
// import { Lock } from "lucide-react";

// const LoginForm = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="bg-white p-4 border border-gray-100 rounded-md shadow-md">
//       <form className="space-y-4">
//         <label for="">Email</label>
//         <div className="relative w-full">
//           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="email"
//             placeholder="your@email.com"
//             className="input_box"
//           />
//         </div>

//         <label for="">Password</label>
//         <div className="relative w-full">
//           <Lock className=" absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
//           <input type="password" placeholder="Password" className="input_box" />
//         </div>
//         <button
//           type="submit"
//           className="btn"
//           onClick={() => navigate("/dashboard")}
//         >
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };
// export default LoginForm;

import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      // Save token
      localStorage.setItem("token", data.token);

      // redirect
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response.data)
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {/* Arena Badge */}
      <div className="flex items-center justify-center">
        <span className="flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full bg-purple-100 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-[#7000ff] dark:text-cyan-400 tracking-widest">
          <Zap size={12} /> ARENA ACCESS
        </span>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Email
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="email"
            placeholder="warrior@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#7000ff]"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Password
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your secret code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#7000ff]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="relative w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#7000ff] to-[#00d4ff] shadow-lg"
      >
        Enter Arena
      </motion.button>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Prepare for battle ⚔️
      </p>
    </form>
  );
};

export default LoginForm;