
import { User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/auth-slice/authSlice";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import axios from "axios";
=======

>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09

const RegisterForm = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD

  // const handleRegister = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const { data } = await axios.post(
  //       "http://localhost:5000/api/auth/register",
  //       {
  //         username,
  //         email,
  //         password,
  //       },
  //     );

  //     alert(data.message || "Registration successful");

  //     // redirect to login
  //     navigate("/signin");
  //   } catch (error) {
  //     alert(error.response?.data?.message || "Registration failed");
  //   }
  // };
=======
>>>>>>> 340c0e839f81a3a05b67adc5a3150b47edccff09
 const handleRegister = async (e) => {
   e.preventDefault();
   const result = await dispatch(registerUser({ username, email, password }));

   if (registerUser.fulfilled.match(result)) {
     alert("Registration successful! Please sign in.");
     navigate("/signin");
   } else {
     alert(result.payload?.message || "Registration failed");
   }
 };
  return (
    <form onSubmit={handleRegister} className="space-y-6">
      {/* Username */}
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
            className="
            w-full pl-10 pr-4 py-3
            rounded-lg
            bg-slate-100 dark:bg-[#0D1117]
            border border-slate-200 dark:border-slate-800
            text-slate-900 dark:text-white
            focus:outline-none
            focus:border-[#7000ff]
            transition
            "
          />
        </div>
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
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
            w-full pl-10 pr-4 py-3
            rounded-lg
            bg-slate-100 dark:bg-[#0D1117]
            border border-slate-200 dark:border-slate-800
            text-slate-900 dark:text-white
            focus:outline-none
            focus:border-[#7000ff]
            transition
            "
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
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
            w-full pl-10 pr-4 py-3
            rounded-lg
            bg-slate-100 dark:bg-[#0D1117]
            border border-slate-200 dark:border-slate-800
            text-slate-900 dark:text-white
            focus:outline-none
            focus:border-[#7000ff]
            transition
            "
          />
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="
        w-full py-3
        rounded-xl
        font-bold
        text-white
        bg-gradient-to-r from-[#7000ff] to-[#00d4ff]
        hover:scale-[1.03]
        transition
        shadow-lg
        "
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;