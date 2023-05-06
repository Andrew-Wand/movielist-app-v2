import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div>
      <div>
        <header>
          <p> Welcome Back!</p>
        </header>

        <main>
          <form>
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

              <img
                src=""
                alt="show password"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </div>

            <Link to="/forgot-password">Forgot Password</Link>

            <div>
              <button type="submit">Sign In</button>
            </div>
          </form>
          {/* Google oauth */}

          <Link to="/sign-up">Sign Up</Link>
        </main>
      </div>
    </div>
  );
}

export default SignIn;
