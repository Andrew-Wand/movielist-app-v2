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
import RatingListEditModal from "../components/RatingListEditModal";
import useLocalStorage from "../hooks/useLocalStorage";
import { BiSearch } from "react-icons/bi";
import { BsTrashFill } from "react-icons/bs";

interface rate {
  data: DocumentData;
  id: string;
}

function RatingList() {
  const [ratinglist, setRatingList] = useState(null);
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

      const ratinglistItems: any[] = [];

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

  const [state, setState] = useState({
    search: "",
    list: [null],
  });

  const handleChange = (e) => {
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
        (item: any) => item.id !== movieId
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
  const fetchNextMovies = async ({ item }) => {
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

      const nextListItems: any[] = [];

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
  const fetchLastMovies = async ({ item }) => {
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

      const lastListItems: any[] = [];

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
    <main>
      {/* <div>
        <form>
          <input type="search" value={state.search} onChange={handleChange} />
        </form>
      </div> */}

      <div className="absolute left-5 top-[7.4rem] lg:top-[32.7%] lg:left-[29.6%]">
        <BiSearch />
      </div>
      <div className="flex justify-between lg:justify-center">
        <div className="lg:mr-[21%]">
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
          <RatingListSort
            setRatingList={setRatingList}
            setLoading={setLoading}
            rateSort={rateSort}
            onFilterChange={onFilterChange}
          />
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : ratinglist && ratinglist?.length > 0 ? (
        <div className="overflow-x-auto p-2 lg:flex lg:flex-col lg:items-center">
          <table
            className="table table-zebra table-compact w-full font-['Staatliches'] mt-3 drop-shadow-xl text-gray-300 rounded-b-lg lg:w-5/12"
            data-theme="aqua"
          >
            <caption className="text-5xl p-5 bg-[#2e5394] border-b-2 rounded-tl-lg rounded-tr-lg drop-shadow-xl">
              Rating List
            </caption>
            {/* head */}
            <thead className="shadow-lg" data-theme="aqua">
              <tr>
                <th></th>
                <th className="text-xl underline text-black">Title</th>
                <th className="text-lg underline text-black">Finished</th>
                <th className="text-lg underline text-black">Rating</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {state.search === ""
                ? ratinglist?.map((item) => (
                    <tr>
                      <th></th>
                      <td className="truncate text-lg">
                        {item.data.movieName}
                      </td>
                      <td>{item.data.date}</td>
                      <td>{item.data.rating} / 10</td>
                      <td>
                        <RatingListEditModal
                          movieItemName={item.data.movieName}
                          movieItemDate={item.data.date}
                          movieItemRating={item.data.rating}
                          fetchRatingList={fetchRatingList}
                          movieRatingId={item.id}
                        />
                      </td>
                      <td>
                        <button
                          className="text-lg mt-2"
                          onClick={() => deleteFromRatingList(item.id)}
                        >
                          <BsTrashFill />
                        </button>
                      </td>
                    </tr>
                  ))
                : state.list?.map((item) => (
                    <tr>
                      <th></th>
                      <td className="truncate text-lg">
                        {item.data.movieName}
                      </td>
                      <td>{item.data.date}</td>
                      <td>{item.data.rating} / 10</td>
                      <td>
                        <RatingListEditModal
                          movieItemName={item.data.movieName}
                          movieItemDate={item.data.date}
                          movieItemRating={item.data.rating}
                          fetchRatingList={fetchRatingList}
                          movieRatingId={item.id}
                        />
                      </td>
                      <td>
                        <button
                          className="text-lg mt-2"
                          onClick={() => deleteFromRatingList(item.id)}
                        >
                          <BsTrashFill />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!state.list.length ? "No results" : ""}
          <div className=" justify-between flex mt-3">
            <div>
              {page === 1 ? (
                ""
              ) : (
                <button
                  onClick={() => fetchLastMovies({ item: ratinglist[0] })}
                  className="btn"
                  data-theme="aqua"
                >
                  Back
                </button>
              )}
            </div>
            {ratinglist?.length < 8 ? (
              ""
            ) : (
              <button
                onClick={() =>
                  fetchNextMovies({ item: ratinglist[ratinglist.length - 1] })
                }
                className="btn"
                data-theme="aqua"
              >
                Next
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

export default RatingList;
