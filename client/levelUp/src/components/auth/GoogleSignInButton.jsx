import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../store/auth-slice/authSlice";

const GoogleSignInButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="text-center text-xs text-amber-600 dark:text-amber-400">
        Google sign-in: add VITE_GOOGLE_CLIENT_ID in client .env
      </p>
    );
  }

  const handleSuccess = async (response) => {
    if (!response?.credential) {
      alert("Google sign-in failed: no credential received");
      return;
    }

    const result = await dispatch(
      googleLogin({ credential: response.credential }),
    );

    if (googleLogin.fulfilled.match(result) && result.payload.success) {
      navigate("/dashboard");
    } else {
      alert(result.payload?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => alert("Google sign-in was cancelled or failed")}
        theme="filled_black"
        shape="pill"
        text="continue_with"
        width="320"
      />
    </div>
  );
};

export default GoogleSignInButton;
