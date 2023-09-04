import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth } from "../../firebase.config";
import { db } from "../../firebase.config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface formInfo {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export default function EmailSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<formInfo>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

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
    if (password === confirmPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password!
        );

        const user = userCredential.user;

        if (auth.currentUser) {
          updateProfile(auth.currentUser, {
            displayName: name,
          });
        }

        const formDataCopy = { ...formData };
        delete formDataCopy.password;
        delete formDataCopy.confirmPassword;

        await setDoc(doc(db, "users", user.uid), formDataCopy);

        navigate("/");
      } catch (error) {
        alert("Something went wrong with registration");
      }
    } else {
      alert("passwords must match");
    }
  };

  return (
    <div className="lg:flex-col lg:justify-center lg:items-center lg:min-h-screen lg:flex lg:bg-[#345da7]">
      <div className="lg:rounded-md lg:w-[500px] lg:py-[36px] lg:px-[40px] lg:flex-col lg:items-stretch  lg:outline-cyan-100 lg:bg-[#272935]">
        <h2 className="hidden lg:block text-blue-500 lg:text-center cursor-default font-['Dancing_Script'] lg:text-5xl ">
          Movie Night
        </h2>
        <header className="text-center text-2xl mt-14 font-light mb-5">
          <h1>Sign Up</h1>
        </header>

        <main>
          <form onSubmit={onSubmit} className="text-center mt-10">
            <div className="form-control px-7">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleOnChange}
                id="name"
                className="input input-md input-bordered input-info"
                placeholder="Type your name..."
              />
            </div>
            <div className="form-control px-7 mt-5">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={handleOnChange}
                id="email"
                className="input input-md input-bordered input-info"
                placeholder="Type your email address..."
              />
            </div>

            <div>
              <div className="form-control px-7 mt-5">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-md input-bordered input-info"
                  id="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Type your password..."
                />
              </div>

              <div className="form-control px-7 mt-5">
                <label className="label">
                  <span className="label-text">Confirm</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-md input-bordered input-info"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Retype your password..."
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

            <div className="text-center mt-10 w-full px-5">
              <button
                type="submit"
                className="btn bg-[#3b82f6]  w-full text-white shadow-lg"
              >
                Create Account
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
