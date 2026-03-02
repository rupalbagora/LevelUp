const RegisterForm = () => {
  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md shadow-md">
      <form className="space-y-4">
        <label for="">Username</label>
        <input type="text" placeholder="Username" className="input_box" />
<label for="">Email</label>
        <input type="email" placeholder="Email" className="input_box" />
<label for="">Password</label>
        <input type="password" placeholder="Password" className="input_box" />
{/* <label for="">Choose Your Avatar</label> */}

        <button type="submit" className="btn">
         Create Account
        </button>
      </form>
    </div>
  );
};
export default RegisterForm;