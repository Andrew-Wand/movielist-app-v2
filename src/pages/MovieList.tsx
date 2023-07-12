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
  DocumentData,
} from "firebase/firestore";
import { db, auth } from "../../firebase.config";
import Loading from "../components/Loading";
import useLocalStorage from "../hooks/useLocalStorage";
import { BiSearch } from "react-icons/bi";
import { BsTrashFill } from "react-icons/bs";

interface movie {
  data: DocumentData;
  id: string;
}

function MovieList() {
  const [movielist, setmovieList] = useState<movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useLocalStorage("sort", []);
  const [searchMovies, setSearchMovies] = useState<movie[]>([]);

  const pageSize = 6;

  // Fetch movies from firebase
  const fetchMovielist = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const q =
        sort === "NEWEST"
          ? query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt", "desc"),
              limit(pageSize)
            )
          : sort === "OLDEST"
          ? query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt"),
              limit(pageSize)
            )
          : sort === "NAME ASC"
          ? query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("movieName"),
              limit(pageSize)
            )
          : sort === "NAME DESC"
          ? query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("movieName", "desc"),
              limit(pageSize)
            )
          : query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt", "desc"),
              limit(pageSize)
            );

      const querySnap = await getDocs(q);

      const movielistItems: movie[] = [];

      querySnap.docs.map((doc) => {
        return movielistItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setmovieList(movielistItems);
      setLoading(false);

      //Search entire array without pagination
      const searchQ = query(
        movielistRef,
        orderBy("createdAt", "desc"),
        where("userRef", "==", auth.currentUser?.uid)
      );

      const searchQuerySnap = await getDocs(searchQ);
      const searchArray: movie[] = [];

      searchQuerySnap.forEach((doc) => {
        return searchArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setSearchMovies(searchArray);
    } catch (error) {
      console.log(error);
    }
  };

  //Filter
  const onFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.currentTarget.value);
  };

  // Next button - fetch next movies
  const fetchNextMovies = async ({ item }: DocumentData) => {
    try {
      const movielistRef = collection(db, "movieslist");

      const next =
        sort === "NEWEST"
          ? query(
              movielistRef,
              orderBy("createdAt", "desc"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.createdAt),
              limit(pageSize)
            )
          : sort === "OLDEST"
          ? query(
              movielistRef,
              orderBy("createdAt"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.createdAt),
              limit(pageSize)
            )
          : sort === "NAME ASC"
          ? query(
              movielistRef,
              orderBy("movieName"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.movieName),
              limit(pageSize)
            )
          : sort === "NAME DESC"
          ? query(
              movielistRef,
              orderBy("movieName", "desc"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.movieName),
              limit(pageSize)
            )
          : query(
              movielistRef,
              orderBy("createdAt", "desc"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.createdAt),
              limit(pageSize)
            );

      const nextSnap = await getDocs(next);

      const nextListItems: movie[] = [];

      nextSnap.docs.map((doc) => {
        return nextListItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setmovieList(nextListItems);
      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Back button
  const fetchLastMovies = async ({ item }: DocumentData) => {
    try {
      const movielistRef = collection(db, "movieslist");

      const previous =
        sort === "NEWEST"
          ? query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt", "desc"),
              endBefore(item.data.createdAt),
              limitToLast(pageSize)
              // limit(8)
            )
          : sort === "OLDEST"
          ? query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt"),
              endBefore(item.data.createdAt),
              limitToLast(pageSize)
              // limit(8)
            )
          : sort === "NAME ASC"
          ? query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("movieName"),
              endBefore(item.data.movieName),
              limitToLast(pageSize)
              // limit(8)
            )
          : sort === "NAME DESC"
          ? query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("movieName", "desc"),
              endBefore(item.data.movieName),
              limitToLast(pageSize)
              // limit(8)
            )
          : query(
              movielistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt", "desc"),
              endBefore(item.data.createdAt),
              limitToLast(pageSize)
              // limit(8)
            );

      const previousSnap = await getDocs(previous);

      const lastListItems: movie[] = [];

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
  }, [sort]);

  // Delete from movie list
  const deleteFromMovieList = async (movieId: string) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "movieslist", movieId));

      const updatedMovieList = movielist.filter((item) => item.id !== movieId);
      setmovieList(updatedMovieList);
      console.log("Success delete!");
    }
  };

  // Searching component

  const [state, setState] = useState<DocumentData>({
    search: "",
    list: [null],
  });

  const handleChange = async (e: React.FormEvent<HTMLInputElement>) => {
    const results = searchMovies.filter((movie) => {
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
    <main>
      <div className="flex justify-between lg:justify-center">
        <div className="h-[32px] w-[30px] bg-blue-400 flex justify-center items-center rounded-l-full ml-5">
          <BiSearch />
        </div>
        <div className="lg:mr-[21%] mr-5">
          <form>
            <input
              type="search"
              value={state.search}
              onChange={handleChange}
              className="input input-bordered input-sm w-10/12 max-w-xs  rounded-l-none"
            />
          </form>
        </div>

        <div>
          <MovieListSort sort={sort} onFilterChange={onFilterChange} />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : movielist && movielist.length > 0 ? (
        <>
          <div className="p-2 mt-3 drop-shadow-xl lg:flex lg:flex-col lg:items-center">
            <table
              className="table table-zebra w-full font-['Staatliches'] rounded-b-lg lg:w-5/12"
              data-theme="aqua"
            >
              <caption
                className="text-5xl p-5 drop-shadow-xl rounded-t-lg border-b-2"
                data-theme="aqua"
              >
                Movie List
              </caption>
              <div className="absolute right-5 top-5">
                <MovieListModal fetchMovieList={fetchMovielist} />
              </div>

              <tbody>
                {state.search === ""
                  ? movielist?.map((movieItem: movie) => (
                      <tr>
                        <td className="text-xl max-w-[210px] ">
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
                          <div className="lg:tooltip" data-tip="Delete">
                            <button
                              className="text-xl mt-2"
                              onClick={() => deleteFromMovieList(movieItem.id)}
                            >
                              <BsTrashFill />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : state.list?.map((movieItem: movie) => (
                      <tr>
                        <td className="text-xl max-w-[210px] ">
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
                          <div className="lg:tooltip" data-tip="Delete">
                            <button
                              className="text-xl mt-2"
                              onClick={() => deleteFromMovieList(movieItem.id)}
                            >
                              <BsTrashFill />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {!state.list.length ? "No results" : ""}
          </div>
          <div className="mt-4 flex justify-around lg:mx-[15%]">
            <div>
              {page === 1 ? (
                ""
              ) : (
                <button
                  onClick={() => fetchLastMovies({ item: movielist[0] })}
                  className="btn"
                  data-theme="aqua"
                >
                  Back
                </button>
              )}
            </div>
            {movielist?.length < 6 ? (
              ""
            ) : (
              <button
                onClick={() =>
                  fetchNextMovies({ item: movielist[movielist.length - 1] })
                }
                className="btn"
                data-theme="aqua"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div>Nothing here</div>
      )}
    </main>
  );
}

export default MovieList;
