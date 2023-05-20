import { useEffect, useState } from "react";
import MovieListModal from "../components/MovieListModal";
import MovieListEditModal from "../components/MovieListEditModal";
import MovieListSort from "../components/MovieListSort";
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
  endBefore,
  limitToLast,
} from "firebase/firestore";
import { db, auth } from "../../firebase.config";
import Loading from "../components/Loading";

function MovieList() {
  const [movielist, setmovieList] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);

  // Fetch movies from firebase
  const fetchMovielist = async () => {
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

  // Next button - fetch next movies
  const fetchNextMovies = async ({ item }) => {
    try {
      const movielistRef = collection(db, "movieslist");
      // const first = query(
      //   movielistRef,
      //   where("userRef", "==", auth.currentUser?.uid),
      //   limit(8)
      // );

      // const querySnap = await getDocs(first);
      // const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      const next = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("createdAt", "desc"),
        startAfter(item.data.createdAt),
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

      // console.log(nextListItems);

      setmovieList(nextListItems);
      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Back button
  const fetchLastMovies = async ({ item }) => {
    try {
      const movielistRef = collection(db, "movieslist");
      // const first = query(
      //   movielistRef,
      //   where("userRef", "==", auth.currentUser?.uid),
      //   limit(8)
      // );

      // const querySnap = await getDocs(first);
      // const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      const previous = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("createdAt", "desc"),
        endBefore(item.data.createdAt),
        limitToLast(8)
      );

      const previousSnap = await getDocs(previous);

      const lastListItems: any[] = [];

      previousSnap.docs.map((doc) => {
        return lastListItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setmovieList(lastListItems);
      setPage(page - 1);
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

  // Searching component

  const [state, setState] = useState({
    search: "",
    list: [null],
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

      <div>
        <MovieListSort
          movielist={movielist}
          setmovieList={setmovieList}
          setLoading={setLoading}
        />
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
              {state.search === ""
                ? movielist?.map((movieItem: any) => (
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
                  ))
                : state.list?.map((movieItem) => (
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
          {!state.list.length ? "No results" : ""}
          <div>
            {movielist?.length < 8 ? (
              <button
                // onClick={() =>
                //   fetchNextMovies({ item: movielist[movielist.length - 1] })
                // }
                disabled
                className="text-black"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() =>
                  fetchNextMovies({ item: movielist[movielist.length - 1] })
                }
              >
                Next
              </button>
            )}
          </div>
          <div>
            <button
              onClick={() => fetchLastMovies({ item: movielist[0] })}
              className={movielist?.legnth <= 8 ? "hidden" : "block"}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}

export default MovieList;
