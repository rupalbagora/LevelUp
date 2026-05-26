import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth-slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import ForgotPasswordModal from "./ForgotPasswordModal";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      loginUser({ email: email.trim().toLowerCase(), password }),
    );

    if (loginUser.fulfilled.match(result) && result.payload.success) {
      navigate("/dashboard");
    } else {
      alert(
        result.payload?.message ||
          (loginUser.rejected.match(result) && result.payload?.message) ||
          "Login failed",
      );
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-6" noValidate>
        <div className="flex items-center justify-center">
          <span className="flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full bg-purple-100 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-[#7000ff] dark:text-cyan-400 tracking-widest">
            <Zap size={12} /> ARENA ACCESS
          </span>
        </div>

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
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1117] border text-slate-900 dark:text-white focus:outline-none focus:border-[#7000ff] ${
                errors.email
                  ? "border-red-400"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-medium">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-xs font-semibold text-[#7000ff] dark:text-cyan-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your secret code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1117] border text-slate-900 dark:text-white focus:outline-none focus:border-[#7000ff] ${
                errors.password
                  ? "border-red-400"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password}</p>
          )}
        </div>

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

      <ForgotPasswordModal isOpen={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
};

export default LoginForm;
