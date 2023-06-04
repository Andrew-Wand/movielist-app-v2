import { auth } from "../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      alert("Bad user credentials");
    }
  };

  return (
    <div>
      <div>
        <header className="text-center text-4xl">
          <h1> Welcome Back!</h1>
        </header>

        <main>
          <form onSubmit={onSubmit} className="text-center mt-10">
            <div className="join">
              <button className="btn btn-sm join-item rounded-r-none">
                Email
              </button>
              <input
                className="input input-sm input-bordered rounded-l-none join-item"
                type="email"
                value={email}
                onChange={handleOnChange}
                id="email"
              />
            </div>

            <div className="mt-5">
              <div className="join">
                <button className="btn btn-sm join-item rounded-r-none">
                  Password
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  className="passwordInput input input-sm rounded-l-none input-bordered"
                  id="password"
                  value={password}
                  onChange={handleOnChange}
                />
              </div>

              <img
                src=""
                alt="show password"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <div className="my-5">
              <Link className="link" to="/forgot-password">
                Forgot Password
              </Link>
            </div>

            <div>
              <button className="btn btn-info" type="submit">
                Sign In
              </button>
            </div>
          </form>
          <OAuth />

          <div className="text-center mt-10">
            <Link className="btn" to="/sign-up">
              Sign Up
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignIn;
