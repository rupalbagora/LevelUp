import { Navigate, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { Lock } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md shadow-md">
      <form className="space-y-4">
        <label for="">Email</label>
        <div className="relative w-full">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="your@email.com"
            className="input_box"
          />
        </div>

        <label for="">Password</label>
        <div className="relative w-full">
          <Lock className=" absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
          <input type="password" placeholder="Password" className="input_box" />
        </div>
        <button
          type="submit"
          className="btn"
          onClick={() => navigate("/dashboard")}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};
export default LoginForm;