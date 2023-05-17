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

  return (
    <div>
      <div>
        <MovieListModal fetchMovieList={fetchMovielist} />
      </div>

      {loading ? (
        <Loading />
      ) : movielist && movielist.length > 0 ? (
        <div className="overflow-x-auto p-2">
          <table className="table table-zebra table-compact w-full">
            <caption className="text-4xl p-5 bg-[#182635]">Movie List</caption>
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th className="text-lg">Title</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {movielist.map((movieItem: any) => (
                <tr>
                  <th></th>
                  <td className="text-lg">{movieItem.data.movieName}</td>
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
                      className="btn"
                      onClick={() => deleteFromMovieList(movieItem.id)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}

export default MovieList;
