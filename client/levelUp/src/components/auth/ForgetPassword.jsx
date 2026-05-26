import { useState } from "react";
import { requestPasswordReset } from "../../services/profileService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await requestPasswordReset(email);
      alert(data.resetToken ? `Testing Mode: Token is ${data.resetToken}` : data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reset request");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md">
        <h2 className="text-xl mb-4">Forgot Password</h2>
        <input 
          className="border p-2 w-full mb-4" 
          type="email" 
          placeholder="Enter your email" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <button className="bg-blue-500 text-white p-2 w-full" type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};
export default ForgotPassword;
