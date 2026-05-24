import { User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/auth-slice/authSlice";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [forgotOpen, setForgotOpen] = useState(false);

  const validate = () => {
    const next = {};
    if (!username.trim()) next.username = "Username is required";
    else if (username.trim().length < 3 || username.trim().length > 30) {
      next.username = "Username must be 3–30 characters";
    }

    if (!email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "Enter a valid email";

    if (!password) next.password = "Password is required";
    else if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      registerUser({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    );

    if (registerUser.fulfilled.match(result) && result.payload?.success !== false) {
      alert("Registration successful! Please sign in.");
      navigate("/signin");
    } else {
      const msg =
        result.payload?.message ||
        (registerUser.rejected.match(result) && result.payload?.message) ||
        "Registration failed";
      alert(msg);
    }
  };

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-[#0D1117] border text-slate-900 dark:text-white focus:outline-none focus:border-[#7000ff] transition ${
                errors.username
                  ? "border-red-400"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500 font-medium">{errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-[#0D1117] border text-slate-900 dark:text-white focus:outline-none focus:border-[#7000ff] transition ${
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
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              placeholder="Create a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-100 dark:bg-[#0D1117] border text-slate-900 dark:text-white focus:outline-none focus:border-[#7000ff] transition ${
                errors.password
                  ? "border-red-400"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#7000ff] to-[#00d4ff] hover:scale-[1.03] transition shadow-lg"
        >
          Create Account
        </button>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="font-semibold text-[#7000ff] dark:text-cyan-400 hover:underline"
          >
            Forgot password
          </button>
        </p>
      </form>

      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </>
  );
};

export default RegisterForm;
