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
  const [ratingslist, setratingsList] = useState<any | null>(null);
  const [topRatinglist, setTopRatinglist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName,
  });

  const { name } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/sign-in");
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
  // Stats for rated list
  const fetchRatingList = async () => {
    try {
      const ratinglistRef = collection(db, "ratingslist");
      const first = query(
        ratinglistRef,
        where("userRef", "==", auth.currentUser?.uid)
      );

      const querySnap = await getDocs(first);

      const ratedlistItems: any[] = [];

      querySnap.docs.map((doc) => {
        return ratedlistItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setratingsList(ratedlistItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch top 10 movies from rating list
  const fetchTopMovies = async () => {
    try {
      const ratinglistRef = collection(db, "ratingslist");
      const first = query(
        ratinglistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("rating", "desc"),
        limit(5)
      );

      const querySnap = await getDocs(first);

      const topRatedItems: any[] = [];

      querySnap.docs.map((doc) => {
        return topRatedItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setTopRatinglist(topRatedItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopMovies();
  }, [loading]);

  // Number for top 5 list
  let listNumber = 1;

  return (
    <div>
      <header className="text-center">
        <h1 className=" text-4xl mb-5">My Profile</h1>
        <button type="button" className="btn" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main>
        <div className="bg-slate-700 text-center p-10 m-5 rounded-xl shadow-xl lg:w-[40%] lg:ml-[30%]">
          <div>
            <p className="text-xl mb-5">Personal Details</p>
          </div>

          <div>
            <form>
              <input
                type="text"
                id="name"
                className={
                  !changeDetails
                    ? "profileName input input-sm mr-5"
                    : "profileNameActive input input-sm mr-5"
                }
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <p
                onClick={() => {
                  changeDetails && onSubmit();
                  setChangeDetails((prevState) => !prevState);
                }}
                className="cursor-pointer btn btn-accent mt-5 btn-sm"
              >
                {changeDetails ? "Done" : "Change"}
              </p>
            </form>
          </div>
        </div>

        <div className="lg:text-center">
          <h2 className="text-center text-3xl my-5">Stats</h2>
          <ProfileStats
            fetchMovielist={fetchMovielist}
            fetchRatingList={fetchRatingList}
            ratingslist={ratingslist}
            loading={loading}
            movielist={movielist}
          />
        </div>

        <div className="divider"></div>

        <div className="overflow-x-auto lg:flex lg:flex-col lg:items-center">
          <h3 className="text-center text-3xl my-5">Top 5 Movies</h3>
          <table className="table table-zebra ml-[10%] mb-10 lg:ml-[1%] shadow-lg">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th className="text-lg">Title</th>
                <th className="text-lg">Rating</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {topRatinglist?.map((item) => (
                <tr>
                  <td className="">{listNumber++}</td>
                  <td className="truncate">{item.data.movieName}</td>
                  <td>{item.data.rating} / 10</td>
                  <th></th>
                  <th></th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Profile;
