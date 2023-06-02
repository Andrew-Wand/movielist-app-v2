import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase.config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //   Check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      //   If user doesn't exist, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
        });
      }
      navigate("/");
    } catch (error) {
      alert("Could not authorize with google");
    }
  };
  return (
    <div className="text-center my-10">
      <p className="text-2xl">
        Sign {location.pathname === "/sign-up" ? "up" : "in"} with
      </p>
      <button onClick={onGoogleClick} className="text-[5rem]">
        <FcGoogle />
      </button>
    </div>
  );
}

export default OAuth;
