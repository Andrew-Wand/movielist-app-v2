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
} from "firebase/firestore";
import { db } from "../../firebase.config";
import Loading from "../components/Loading";

function MovieList() {
  const [movielist, setmovieList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovielist = async () => {
      try {
        const movielistRef = collection(db, "movieslist");
        const q = query(movielistRef);

        const querySnap = await getDocs(q);

        let movielistItems = [];

        querySnap.forEach((doc) => {
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

    fetchMovielist();
  }, []);

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
            <li>{movieItem.data.movieName}</li>
          ))}
        </ul>
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}

export default MovieList;
