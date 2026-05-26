import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound } from "lucide-react";
import {
  requestPasswordReset,
  resetPasswordWithToken,
} from "../../services/profileService";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setStep("request");
    setEmail("");
    setToken("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      const data = await requestPasswordReset(email.trim());
      setSuccess(data.message);
      if (data.resetToken) {
        setToken(data.resetToken);
        setStep("reset");
      } else {
        setStep("reset");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset request");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Reset token is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPasswordWithToken({
        token: token.trim(),
        password,
      });
      setSuccess(data.message);
      setTimeout(handleClose, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0f1f] p-8 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {step === "request" ? "Forgot Password" : "Reset Password"}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-red-500 font-bold"
            >
              ✕
            </button>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500 font-medium">{error}</p>
          )}
          {success && (
            <p className="mb-4 text-sm text-emerald-600 font-medium">{success}</p>
          )}

          {step === "request" ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter your account email. In development, the reset token is
                returned in the response.
              </p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="warrior@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#7000ff]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#7000ff] to-[#00d4ff] disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste reset token"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#7000ff]"
                />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min 6 chars)"
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#7000ff]"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-[#7000ff]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#7000ff] to-[#00d4ff] disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
  
};

export default ForgotPasswordModal;
