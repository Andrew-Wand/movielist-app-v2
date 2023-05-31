import {
  collection,
  getDocs,
  query,
  doc,
  where,
  deleteDoc,
  limit,
  startAfter,
  orderBy,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import { db, auth } from "../../firebase.config";

function MovieListSort({
  movielist,
  setmovieList,
  setLoading,
  sort,
  onFilterChange,
}) {
  const handleNameAscend = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const first = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("movieName"),
        limit(8)
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
  const handleNameDescend = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const first = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("movieName", "desc"),
        limit(8)
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
  const handleDateAscend = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const first = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("createdAt"),
        limit(8)
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
  const handleDateDescend = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const first = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("createdAt", "desc"),
        limit(8)
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
      <select
        name=""
        id=""
        onChange={onFilterChange}
        className="select select-bordered select-sm mr-3 lg:text-lg"
        data-theme="halloween"
      >
        {/* <option value=""  onClick={handleDateDescend}>
          Date (descending)
        </option>
        <option value="" onClick={handleDateAscend}>
          Date (ascending)
        </option>
        <option value="" onClick={handleNameAscend}>
          Name (ascending)
        </option>
        <option value="" onClick={handleNameDescend}>
          Name (descending)
        </option> */}
        <option selected={sort == "NEWEST" ? true : false}>NEWEST</option>
        <option selected={sort == "OLDEST" ? true : false}>OLDEST</option>
        <option selected={sort == "NAME ASC" ? true : false}>NAME ASC</option>
        <option selected={sort == "NAME DESC" ? true : false}>NAME DESC</option>
      </select>
    </div>
  );
}

export default MovieListSort;
