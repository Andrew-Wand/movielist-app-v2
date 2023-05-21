import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../firebase.config";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  limit,
  startAfter,
  orderBy,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import ProfileStats from "../components/ProfileStats";

function Profile() {
  const [user, setUser] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [movielist, setmovieList] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
  });

  const { name } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser?.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
    } catch (error) {
      alert("could not update info");
    }
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Stats for movie list
  const fetchMovielist = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const first = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid)
      );

      const querySnap = await getDocs(first);

      const movielistItems: any[] = [];

      querySnap.docs.map((doc) => {
        return movielistItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setmovieList(movielistItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <header>
        <p>My Profile</p>
        <button type="button" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main>
        <div>
          <p>Personal Details</p>
          <p
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div>
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
          </form>
        </div>
        <div>
          <ProfileStats
            fetchMovielist={fetchMovielist}
            loading={loading}
            movielist={movielist}
          />
        </div>
      </main>
    </div>
  );
}

export default Profile;
