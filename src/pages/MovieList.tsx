import { useEffect, useState } from "react";
import MovieListModal from "../components/MovieListModal";
import {
  collection,
  getDocs,
  query,
  limit,
  setDoc,
  doc,
  addDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase.config";
import Loading from "../components/Loading";

function MovieList() {
  const userId = auth.currentUser?.uid;

  const [movielist, setmovieList] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch movies from firebase
  const fetchMovielist = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const q = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid)
      );

      const querySnap = await getDocs(q);

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

  useEffect(() => {
    fetchMovielist();
  }, [loading]);

  const deleteFromMovieList = async (movieId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "movieslist", movieId));

      const updatedMovieList = movielist.filter((item) => item.id !== movieId);
      setmovieList(updatedMovieList);
      console.log("Success delete!");
    }
  };

  return (
    <div>
      <h1>MovieList </h1>
      <div>
        <MovieListModal />
      </div>

      {loading ? (
        <Loading />
      ) : movielist && movielist.length > 0 ? (
        <ul>
          {movielist.map((movieItem) => (
            <li>
              {movieItem.data.movieName}
              <button
                className="btn btn-sm"
                onClick={() => deleteFromMovieList(movieItem.id)}
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}

export default MovieList;
