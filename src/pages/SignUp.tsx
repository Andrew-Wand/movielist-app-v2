import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

// interface formInfo {
//   name: string;
//   email: string;
//   password?: string;
//   confirmPassword?: string;
// }

function SignUp() {
  // const [showPassword, setShowPassword] = useState(false);
  // const [formData, setFormData] = useState<formInfo>({
  //   name: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  // const { name, email, password, confirmPassword } = formData;

  // const navigate = useNavigate();

  // const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
  //   const id = e.currentTarget.id;
  //   const value = e.currentTarget.value;
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [id]: value,
  //   }));
  // };

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (password === confirmPassword) {
  //     try {
  //       const userCredential = await createUserWithEmailAndPassword(
  //         auth,
  //         email,
  //         password!
  //       );

  //       const user = userCredential.user;

  //       if (auth.currentUser) {
  //         updateProfile(auth.currentUser, {
  //           displayName: name,
  //         });
  //       }

  //       const formDataCopy = { ...formData };
  //       delete formDataCopy.password;
  //       delete formDataCopy.confirmPassword;

  //       await setDoc(doc(db, "users", user.uid), formDataCopy);

  //       navigate("/");
  //     } catch (error) {
  //       alert("Something went wrong with registration");
  //     }
  //   } else {
  //     alert("passwords must match");
  //   }
  // };

  return (
    <div className="lg:flex-col lg:justify-center lg:items-center lg:min-h-screen lg:flex lg:bg-[#050d1a]">
      <div className="lg:rounded-md lg:w-[480px] lg:py-[36px] lg:px-[40px] lg:flex-col lg:items-stretch  lg:outline-cyan-100 lg:bg-[#272935]">
        <h2 className="hidden lg:block text-white lg:text-center cursor-default font-['Dancing_Script'] lg:text-5xl ">
          Movie Night
        </h2>
        <header className="text-center text-2xl mt-14 font-light mb-5">
          <h1>Sign Up</h1>
        </header>

        <main>
          <div className="flex flex-col items-center">
            <OAuth />
            <div className="divider">OR</div>
            <Link
              className="btn btn-outline text-lg font-light mt-10"
              to="/sign-up/email"
            >
              Sign up with email address
            </Link>
          </div>

          {/* <div className="text-center btn btn-outline ">
            <p className="text-lg font-light">Sign up with email address</p>
          </div> */}

          <div className="text-center mt-20 w-full px-5">
            <Link
              className="btn w-full text-white shadow-lg bg-[#5371a2]"
              to="/sign-in"
            >
              Back to Sign In
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SignUp;
