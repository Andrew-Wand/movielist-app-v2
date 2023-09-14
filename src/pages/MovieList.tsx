import { useEffect, useState } from "react";
import MovieListModal from "../components/MovieListModal";

import MovieListSort from "../components/MovieListSort";

import MovieListCard from "../components/MovieListCard";
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
import { HiFilm } from "react-icons/hi";

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
    <main className="xl:mx-[35rem]">
      <div className="flex justify-around mt-8 mb-5 lg:justify-between lg:mx-6">
        <div className="font-['Roboto']">
          <h2 className="text-2xl mr-20 font-bold lg:text-4xl">Movie List</h2>
          <p className="text-sm font-light text-slate-400 lg:text-lg">
            {searchMovies.length} Total To Watch
          </p>
        </div>
        <div className="">
          <MovieListModal fetchMovieList={fetchMovielist} />
        </div>
      </div>

      <div className="divider text-5xl">
        <HiFilm />
      </div>

      <div className="flex justify-evenly mb-5 lg:mt-14 lg:justify-between lg:mx-6">
        <div className="flex">
          {/* <div className="">
            <BiSearch />
          </div> */}

          <form>
            <input
              type="search"
              value={state.search}
              onChange={handleChange}
              className="input input-bordered input-sm w-9/12 max-w-xs bg-white border-none text-black lg:input-md lg:w-full "
              placeholder="Search movie title..."
            />
          </form>
        </div>
        <div className="">
          <MovieListSort sort={sort} onFilterChange={onFilterChange} />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : movielist && movielist.length > 0 ? (
        <>
          <MovieListCard
            movielist={movielist}
            list={state.list}
            search={state.search}
            deleteFromMovieList={deleteFromMovieList}
            fetchMovielist={fetchMovielist}
          />
          {/* <div className="p-2 mt-3 drop-shadow-xl lg:flex lg:flex-col lg:items-center ">
            <table className="table table-zebra w-full font-['Staatliches'] lg:w-5/12 rounded-lg  ">
              <caption className="text-5xl p-5 shadow-xl  bg-[#2f5496] rounded-tr-lg rounded-tl-lg ">
                Movie List
              </caption>

              <tbody>
                {state.search === ""
                  ? movielist?.map((movieItem: movie) => (
                      <tr>
                        <td className="text-xl max-w-[210px] font-['Roboto'] text-white ">
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
                        <td className="text-xl max-w-[210px] font-['Roboto'] text-white ">
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
          </div> */}

          <div className="mt-4 pb-28 join flex justify-center lg:mx-[15%]">
            {page === 1 ? (
              <button
                disabled
                className="btn  btn-info join-item rounded-tr-none rounded-br-none "
                data-theme="aqua"
              >
                «
              </button>
            ) : (
              <button
                onClick={() => fetchLastMovies({ item: movielist[0] })}
                className="btn   join-item rounded-tr-none rounded-br-none "
                data-theme="aqua"
              >
                «
              </button>
            )}

            <button className="join-item btn rounded-none ">Page {page}</button>

            {movielist?.length < 6 ? (
              <button
                onClick={() =>
                  fetchNextMovies({ item: movielist[movielist.length - 1] })
                }
                disabled
                className=" btn join-item rounded-tl-none rounded-bl-none "
                data-theme="aqua"
              >
                »
              </button>
            ) : (
              <button
                onClick={() =>
                  fetchNextMovies({ item: movielist[movielist.length - 1] })
                }
                className=" btn join-item rounded-tl-none rounded-bl-none "
                data-theme="aqua"
              >
                »
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
