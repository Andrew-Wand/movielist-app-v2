import {
  collection,
  getDocs,
  query,
  limit,
  doc,
  where,
  deleteDoc,
  orderBy,
  startAfter,
  endBefore,
  limitToLast,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase.config";
import Loading from "../components/Loading";
import RatingListSort from "../components/RatingListSort";
import RatingListCard from "../components/RatingListCard";
import useLocalStorage from "../hooks/useLocalStorage";
import { HiFilm } from "react-icons/hi";

interface rate {
  data: DocumentData;
  id: string;
}

function RatingList() {
  const [ratinglist, setRatingList] = useState<rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [searchRated, setSearchRated] = useState<rate[]>([]);
  const pageSize = 8;

  const [rateSort, setRateSort] = useLocalStorage("rateSort", []);

  // Fetch movies from firebase
  const fetchRatingList = async () => {
    try {
      const ratinglistRef = collection(db, "ratingslist");
      const q =
        rateSort === "NEW"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt", "desc"),
              limit(pageSize)
            )
          : rateSort === "OLD"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt"),
              limit(pageSize)
            )
          : rateSort === "NAME ASC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("movieName"),
              limit(pageSize)
            )
          : rateSort === "NAME DESC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("movieName", "desc"),
              limit(pageSize)
            )
          : rateSort === "RATING DESC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("rating", "desc"),
              limit(pageSize)
            )
          : rateSort === "RATING ASC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("rating"),
              limit(pageSize)
            )
          : rateSort === "FINISHED ASC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("date"),
              limit(pageSize)
            )
          : rateSort === "FINISHED DESC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("date", "desc"),
              limit(pageSize)
            )
          : query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt", "desc"),
              limit(pageSize)
            );

      const querySnap = await getDocs(q);

      const ratinglistItems: rate[] = [];

      querySnap.docs.map((doc) => {
        return ratinglistItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setRatingList(ratinglistItems);
      setLoading(false);

      // Search entire array without pagination
      const searchQ = query(
        ratinglistRef,
        orderBy("createdAt", "desc"),
        where("userRef", "==", auth.currentUser?.uid)
      );

      const searchQuerySnap = await getDocs(searchQ);
      const searchArray: rate[] = [];

      searchQuerySnap.forEach((doc) => {
        return searchArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setSearchRated(searchArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRatingList();
  }, [rateSort]);

  // Searching component

  const [state, setState] = useState<DocumentData>({
    search: "",
    list: [null],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement & HTMLInputElement>
  ) => {
    const results = searchRated?.filter((movie) => {
      if (e.currentTarget.value === "") {
        return ratinglist;
      } else if (
        movie.data.movieName
          .toLowerCase()
          .includes(e.currentTarget.value.toLowerCase())
      ) {
        return movie;
      }
      return false;
    });

    setState({
      search: e.currentTarget.value,
      list: results,
    });
  };

  // Delete from movie list
  const deleteFromRatingList = async (movieId: string) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "ratingslist", movieId));

      const updatedRatingList = ratinglist.filter(
        (item) => item.id !== movieId
      );
      setRatingList(updatedRatingList);
      console.log("Success delete!");
    }
  };
  //Filter
  const onFilterChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setRateSort(e.currentTarget.value);
  };

  // Next button - fetch next movies
  const fetchNextMovies = async ({ item }: DocumentData) => {
    try {
      const ratinglistRef = collection(db, "ratingslist");

      const next =
        rateSort === "NEW"
          ? query(
              ratinglistRef,
              orderBy("createdAt", "desc"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.createdAt),
              limit(pageSize)
            )
          : rateSort === "OLD"
          ? query(
              ratinglistRef,
              orderBy("createdAt"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.createdAt),
              limit(pageSize)
            )
          : rateSort === "NAME ASC"
          ? query(
              ratinglistRef,
              orderBy("movieName"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.movieName),
              limit(pageSize)
            )
          : rateSort === "NAME DESC"
          ? query(
              ratinglistRef,
              orderBy("movieName", "desc"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.movieName),
              limit(pageSize)
            )
          : rateSort === "RATING DESC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("rating", "desc"),
              startAfter(item.data.rating),
              limit(pageSize)
            )
          : rateSort === "RATING ASC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("rating"),
              startAfter(item.data.rating),
              limit(pageSize)
            )
          : rateSort === "FINISHED ASC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("date"),
              startAfter(item.data.date),
              limit(pageSize)
            )
          : rateSort === "FINISHED DESC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("date", "desc"),
              startAfter(item.data.date),
              limit(pageSize)
            )
          : query(
              ratinglistRef,
              orderBy("createdAt", "desc"),
              where("userRef", "==", auth.currentUser?.uid),
              startAfter(item.data.createdAt),
              limit(pageSize)
            );

      const nextSnap = await getDocs(next);

      const nextListItems: rate[] = [];

      nextSnap.docs.map((doc) => {
        return nextListItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setRatingList(nextListItems);
      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Back button
  const fetchLastMovies = async ({ item }: DocumentData) => {
    try {
      const ratinglistRef = collection(db, "ratingslist");

      const previous =
        rateSort === "NEW"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt", "desc"),
              endBefore(item.data.createdAt),
              limitToLast(pageSize)
            )
          : rateSort === "OLD"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt"),
              endBefore(item.data.createdAt),
              limitToLast(pageSize)
            )
          : rateSort === "NAME ASC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("movieName"),
              endBefore(item.data.movieName),
              limitToLast(pageSize)
            )
          : rateSort === "NAME DESC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("movieName", "desc"),
              endBefore(item.data.movieName),
              limitToLast(pageSize)
            )
          : rateSort === "RATING DESC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("rating", "desc"),
              endBefore(item.data.rating),
              limitToLast(pageSize)
            )
          : rateSort === "RATING ASC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("rating"),
              endBefore(item.data.rating),
              limitToLast(pageSize)
            )
          : rateSort === "FINISHED ASC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("date"),
              endBefore(item.data.date),
              limitToLast(pageSize)
            )
          : rateSort === "FINISHED DESC"
          ? query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("date", "desc"),
              endBefore(item.data.date),
              limitToLast(pageSize)
            )
          : query(
              ratinglistRef,
              where("userRef", "==", auth.currentUser?.uid),
              orderBy("createdAt", "desc"),
              endBefore(item.data.createdAt),
              limitToLast(pageSize)
            );

      const previousSnap = await getDocs(previous);

      const lastListItems: rate[] = [];

      previousSnap.docs.map((doc) => {
        return lastListItems.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setRatingList(lastListItems);
      setPage(page - 1);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="xl:mx-[35rem]">
      <div className="flex flex-col p-5">
        <div className="font-['Roboto']">
          <h2 className="text-2xl mr-20 font-bold lg:text-4xl">Rating List</h2>
          <p className="text-sm font-light text-slate-400 lg:text-lg">
            {searchRated.length} Movies Watched
          </p>
        </div>
        <div className="divider text-5xl">
          <HiFilm />
        </div>

        <div className="flex lg:mt-10 justify-evenly lg:justify-between">
          <form>
            <input
              type="search"
              value={state.search}
              onChange={handleChange}
              className="input input-bordered input-sm w-9/12 max-w-xs bg-white border-none text-black lg:input-md lg:w-full"
              placeholder="Search movie title..."
            />
          </form>
          <RatingListSort rateSort={rateSort} onFilterChange={onFilterChange} />
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : ratinglist && ratinglist?.length > 0 ? (
        <>
          <RatingListCard
            ratinglist={ratinglist}
            list={state.list}
            search={state.search}
            fetchRatingList={fetchRatingList}
            deleteFromRatingList={deleteFromRatingList}
          />

          {!state.list.length ? "No results" : ""}

          {/* Pagination */}
          <div className="mt-4 pb-28 join flex justify-center lg:mx-[15%]">
            {page === 1 ? (
              <button
                disabled
                className="btn  btn-info join-item rounded-tr-none rounded-br-none bg-[#86a6da] "
              >
                «
              </button>
            ) : (
              <button
                onClick={() => fetchLastMovies({ item: ratinglist[0] })}
                className="btn   join-item rounded-tr-none rounded-br-none bg-[#86a6da] "
              >
                «
              </button>
            )}

            <button className="join-item btn rounded-none ">Page {page}</button>

            {ratinglist?.length < 8 ? (
              <button
                onClick={() =>
                  fetchNextMovies({ item: ratinglist[ratinglist.length - 1] })
                }
                disabled
                className=" btn join-item rounded-tl-none rounded-bl-none bg-[#86a6da] "
              >
                »
              </button>
            ) : (
              <button
                onClick={() =>
                  fetchNextMovies({ item: ratinglist[ratinglist.length - 1] })
                }
                className=" btn join-item rounded-tl-none rounded-bl-none bg-[#86a6da] "
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

export default RatingList;
