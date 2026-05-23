import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth-slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

<<<<<<< HEAD
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const { data } = await axios.post(
  //       "http://localhost:5000/api/auth/login",
  //       {
  //         email,
  //         password,
  //       },
  //     );

  //     // Save token
  //     localStorage.setItem("token", data.token);

  //     // redirect
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.log(error.response.data)
  //     alert(error.response?.data?.message || "Login failed");
  //   }
  // };
=======
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
const handleLogin = async (e) => {
  e.preventDefault();
  const result = await dispatch(loginUser({ email, password }));

  if (loginUser.fulfilled.match(result) && result.payload.success) {
    navigate("/dashboard");
  } else {
    alert(result.payload?.message || "Login failed");
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

