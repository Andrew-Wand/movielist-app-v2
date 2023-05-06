import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase.config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
    <div>
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with</p>
      <button onClick={onGoogleClick}>**google icon here**</button>
    </div>
  );
}

export default OAuth;
