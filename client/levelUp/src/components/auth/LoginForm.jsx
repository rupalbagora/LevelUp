const LoginForm = () => {
  return (
    <form className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Sign In
      </button>
    </form>
  );
};
export default LoginForm;