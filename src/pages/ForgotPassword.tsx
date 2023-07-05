import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Email was sent!");
    } catch (error) {
      alert("Cannot send email");
    }
  };

  return (
    <div>
      <header className="text-center text-4xl mt-8">
        <p>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit} className="text-center">
          <div className="join my-10">
            <label className="btn btn-md join-item rounded-r-none">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              className="input input-md input-bordered rounded-l-none join-item lg:w-[23%]"
            />
          </div>
          <div className="my-5">
            <button className="btn">Send Reset Link</button>
          </div>

          <Link to="/sign-in" className="btn btn-info">
            Back to Sign In
          </Link>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
