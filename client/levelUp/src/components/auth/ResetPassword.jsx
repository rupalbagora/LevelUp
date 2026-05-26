import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPasswordWithToken } from "../../services/profileService";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPasswordWithToken({ token, password });
      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md">
        <h2 className="text-xl mb-4">Set New Password</h2>
        <input 
          className="border p-2 w-full mb-4" 
          type="password" 
          placeholder="New Password" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="bg-green-500 text-white p-2 w-full" type="submit">Reset Password</button>
      </form>
    </div>
  );
};
export default ResetPassword;
