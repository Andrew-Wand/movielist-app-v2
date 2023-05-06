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
      <header>
        <p>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <Link to="/sign-in">Sign In</Link>

          <div>
            <button>Send Reset Link</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
