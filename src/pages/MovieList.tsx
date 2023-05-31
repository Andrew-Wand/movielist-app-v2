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
  const [movielist, setmovieList] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useLocalStorage("sort", []);
  const [searchMovies, setSearchMovies] = useState<movie[]>([]);

  const pageSize = 8;

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

      // query(
      //   movielistRef,
      //   where("userRef", "==", auth.currentUser?.uid),
      //   orderBy("createdAt", "desc"),
      //   limit(8)
      // );

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
  const onFilterChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setSort(e.currentTarget.value);
  };

  // Next button - fetch next movies
  const fetchNextMovies = async ({ item }) => {
    try {
      const movielistRef = collection(db, "movieslist");
      const derp = page * 8;
      console.log(movielist[0]);
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

      const nextListItems: any[] = [];

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
  const fetchLastMovies = async ({ item }) => {
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
    // console.log(movielist[page * 8]);
  }, [sort]);

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
      <div className="absolute left-5 top-[7.4rem]">
        <BiSearch />
      </div>
      <div className="flex justify-between">
        <div>
          <form>
            <input
              type="search"
              value={state.search}
              onChange={handleChange}
              className="input input-bordered input-sm w-10/12 max-w-xs pl-7 ml-3"
              // placeholder="Search here..."
            />
          </form>
        </div>

        <div>
          <MovieListSort
            movielist={movielist}
            setmovieList={setmovieList}
            setLoading={setLoading}
            sort={sort}
            onFilterChange={onFilterChange}
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : movielist && movielist.length > 0 ? (
        <div className="overflow-x-auto p-2 mt-3 drop-shadow-xl">
          <table className="table table-zebra w-full font-['Staatliches']">
            <caption className="text-5xl p-5 bg-[#182635] drop-shadow-xl rounded-lg">
              Movie List
            </caption>
            <div className="absolute right-5 top-5">
              <MovieListModal fetchMovieList={fetchMovielist} />
            </div>

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
                        <button
                          className="text-xl mt-2"
                          onClick={() => deleteFromMovieList(movieItem.id)}
                        >
                          <BsTrashFill />
                        </button>
                      </td>
                    </tr>
                  ))
                : state.list?.map((movieItem) => (
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
                        <button
                          className="text-xl mt-2"
                          onClick={() => deleteFromMovieList(movieItem.id)}
                        >
                          <BsTrashFill />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!state.list.length ? "No results" : ""}
          <div>
            {movielist?.length < 8 ? (
              ""
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
            {page === 1 ? (
              ""
            ) : (
              <button onClick={() => fetchLastMovies({ item: movielist[0] })}>
                Back
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>Nothing here</div>
      )}
    </main>
  );
}

export default MovieList;
