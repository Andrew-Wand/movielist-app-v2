import { useEffect, useState } from "react";
import MovieListModal from "../components/MovieListModal";
import MovieListEditModal from "../components/MovieListEditModal";
import RatingListModal from "../components/RatingListModal";
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
} from "firebase/firestore";
import { db, auth } from "../../firebase.config";
import Loading from "../components/Loading";

function MovieList() {
  const [movielist, setmovieList] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch movies from firebase
  const fetchMovielist = async () => {
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

  const fetchNextMovies = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const first = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        limit(8)
      );

      const querySnap = await getDocs(first);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      const next = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        startAfter(lastVisible),
        limit(8)
      );

      const nextSnap = await getDocs(next);

      const nextListItems: any[] = [];

      nextSnap.docs.map((doc) => {
        return nextListItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setmovieList(nextListItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMovielist();
  }, [loading]);

  // Delete from movie list
  const deleteFromMovieList = async (movieId: string) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "movieslist", movieId));

      const updatedMovieList = movielist.filter(
        (item: any) => item.id !== movieId
      );
      setmovieList(updatedMovieList);
      console.log("Success delete!");
    }
  };

  const [state, setState] = useState({
    search: "",
    list: [],
  });

  const handleChange = async (e) => {
    const results = movielist.filter((movie) => {
      if (e.currentTarget.value === "") {
        return movielist;
      }
      return movie.data.movieName
        .toLowerCase()
        .includes(e.currentTarget.value.toLowerCase());
    });
    setState({
      search: e.currentTarget.value,
      list: results,
    });
  };

  return (
    <div>
      <div>
        <form>
          <input type="search" value={state.search} onChange={handleChange} />
        </form>
      </div>
      <div>
        <MovieListModal fetchMovieList={fetchMovielist} />
      </div>

      {loading ? (
        <Loading />
      ) : movielist && movielist.length > 0 ? (
        <div className="overflow-x-auto p-2">
          <table className="table table-zebra w-full">
            <caption className="text-4xl p-5 bg-[#182635]">Movie List</caption>
            {/* head */}
            <thead>
              {/* <tr>
                <th className="text-lg">Title</th>
                <th></th>
                <th></th>
                <th></th>
              </tr> */}
            </thead>
            <tbody>
              {state.list?.map((movieItem: any) => (
                <tr>
                  <td className="text-md max-w-[210px] ">
                    <p className="truncate">{movieItem.data.movieName}</p>
                  </td>
                  <td>
                    <RatingListModal
                      movieRatingId={movieItem.id}
                      fetchMovielist={fetchMovielist}
                    />
                  </td>
                  <td>
                    <MovieListEditModal
                      movieItemName={movieItem.data.movieName}
                      fetchMovielist={fetchMovielist}
                      movieRatingId={movieItem.id}
                    />
                  </td>
                  <td>
                    <button
                      className=""
                      onClick={() => deleteFromMovieList(movieItem.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={fetchNextMovies}>Next</button>
          </div>
        </div>
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}

export default MovieList;
