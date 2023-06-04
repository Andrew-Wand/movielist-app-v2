import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth } from "../../firebase.config";
import { db } from "../../firebase.config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

interface formInfo {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

function SignUp() {
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

        updateProfile(auth.currentUser!, {
          displayName: name,
        });

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
    <div>
      <div>
        <header className="text-center text-4xl">
          <h1>Sign Up</h1>
        </header>

        <main>
          <form onSubmit={onSubmit} className="text-center mt-10">
            <div className="join">
              <button className="btn btn-sm join-item rounded-r-none">
                Name
              </button>
              <input
                type="text"
                value={name}
                onChange={handleOnChange}
                id="name"
                className="input input-sm input-bordered rounded-l-none join-item"
              />
            </div>
            <div className="join my-5">
              <button className="btn btn-sm join-item rounded-r-none">
                Email
              </button>
              <input
                type="email"
                value={email}
                onChange={handleOnChange}
                id="email"
                className="input input-sm input-bordered rounded-l-none join-item"
              />
            </div>

            <div>
              <div className="join my-5">
                <button className="btn btn-sm join-item rounded-r-none">
                  Password
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  className="passwordInput input input-sm input-bordered rounded-l-none join-item"
                  id="password"
                  value={password}
                  onChange={handleOnChange}
                />
              </div>

              <div className="join">
                <button className="btn btn-sm join-item rounded-r-none">
                  Confirm
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  className="passwordInput input input-sm input-bordered rounded-l-none join-item"
                  id="confirmPassword"
                  value={confirmPassword}
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
              <button type="submit" className="btn btn-info">
                Sign Up
              </button>
            </div>
          </form>
          <OAuth />

          <div className="text-center mt-10">
            <Link className="btn" to="/sign-in">
              Sign In
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignUp;
