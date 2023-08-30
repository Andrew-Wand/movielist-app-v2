import { auth } from "../../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function SignIn() {
  // const [showPassword, setShowPassword] = useState(false);
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
        <header className="text-center text-4xl mt-10 font-light">
          <h1> Sign In </h1>
        </header>

        <main>
          <div className="justify-center flex">
            <div>
              <OAuth />
            </div>
          </div>

          <div className="divider">OR</div>
          <form onSubmit={onSubmit} className="text-center mt-5">
            <div className="px-7 form-control">
              {/* <label className="btn btn-md join-item rounded-r-none">
                Email
              </label> */}
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                className="input input-md input-bordered lg:w-[22%] input-info"
                type="email"
                value={email}
                onChange={handleOnChange}
                id="email"
                aria-label="Input for your email address."
                placeholder="Type your email..."
              />
            </div>

            <div className="">
              <div className="form-control px-7 mt-5">
                {/* <label className="btn btn-md join-item rounded-r-none">
                  Password
                </label> */}
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  // type={showPassword ? "text" : "password"}
                  className="passwordInput input input-md input-info input-bordered lg:w-[20%]"
                  id="password"
                  value={password}
                  onChange={handleOnChange}
                  aria-label="Input for your password."
                  placeholder="Type your password..."
                />
              </div>
            </div>
            {/* <img
              src=""
              alt="Show password"
              onClick={() => setShowPassword((prevState) => !prevState)}
            /> */}
            <div className="my-5">
              <Link className="link" to="/forgot-password">
                Forgot Password
              </Link>
            </div>

            <div className="w-full px-5">
              <button className="btn btn-info w-full shadow-lg " type="submit">
                Log In
              </button>
            </div>
          </form>
          {/* <OAuth /> */}

          <div className="text-center mt-10 w-full px-5">
            <Link className="btn w-full text-white shadow-lg " to="/sign-up">
              Sign Up
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignIn;
