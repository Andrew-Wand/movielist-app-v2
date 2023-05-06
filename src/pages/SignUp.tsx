import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth } from "../../firebase.config";
import { db } from "../../firebase.config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// import { db } from "../firebase.config.js";

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
        console.log(error);
      }
    } else {
      alert("passwords must match");
    }
  };

  return (
    <div>
      <div>
        <header>
          <p> Welcome Back!</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleOnChange}
              id="name"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleOnChange}
              id="email"
            />
            <div>
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                onChange={handleOnChange}
              />
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="Confirm Password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
              />

              <img
                src=""
                alt="show password"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <Link to="/forgot-password">Forgot Password</Link>

            <div>
              <button type="submit">Sign Up</button>
            </div>
          </form>
          {/* Google oauth */}

          <Link to="/sign-up">Sign In</Link>
        </main>
      </div>
    </div>
  );
}

export default SignUp;
