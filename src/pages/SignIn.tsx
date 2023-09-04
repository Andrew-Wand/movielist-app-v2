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
    <div className="lg:flex-col lg:justify-center lg:items-center lg:min-h-screen lg:flex lg:bg-[#345da7] ">
      <main className="lg:rounded-md lg:w-[480px] lg:py-[36px] lg:px-[40px] lg:flex-col lg:items-stretch  lg:outline-cyan-100 lg:bg-[#272935]">
        <h2 className="hidden lg:block text-blue-500 lg:text-center cursor-default font-['Dancing_Script'] lg:text-5xl ">
          Movie Night
        </h2>
        <div className="divider lg:flex block"></div>
        <header className="text-center text-2xl mt-10 font-light">
          <h3> Sign In </h3>
        </header>

        <div>
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
                className="input input-md input-bordered input-info"
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
                  className="passwordInput input input-md input-info input-bordered"
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
              <button
                className="btn text-white bg-[#3b82f6] w-full shadow-lg "
                type="submit"
              >
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
        </div>
      </main>
    </div>
  );
}

export default SignIn;
