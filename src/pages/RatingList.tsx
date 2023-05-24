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
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase.config";
import Loading from "../components/Loading";
import RatingListSort from "../components/RatingListSort";
import RatingListEditModal from "../components/RatingListEditModal";

function RatingList() {
  const [ratinglist, setRatingList] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch movies from firebase
  const fetchRatingList = async () => {
    try {
      const ratinglistRef = collection(db, "ratingslist");
      const q = query(
        ratinglistRef,
        where("userRef", "==", auth.currentUser?.uid)
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRatingList();
  }, [loading]);

  // Searching component

  const [state, setState] = useState({
    search: "",
    list: [null],
  });

  const handleChange = async (e) => {
    const results = ratinglist.filter((movie) => {
      if (e.currentTarget.value === "") {
        return ratinglist;
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

  return (
    <div>
      <div>
        <form>
          <input type="search" value={state.search} onChange={handleChange} />
        </form>
      </div>
      <div>
        <RatingListSort setRatingList={setRatingList} setLoading={setLoading} />
      </div>
      {loading ? (
        <Loading />
      ) : ratinglist && ratinglist?.length > 0 ? (
        <div className="overflow-x-auto p-2">
          <table className="table table-zebra table-compact w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Date</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>
              {state.search === ""
                ? ratinglist?.map((item) => (
                    <tr>
                      <th></th>
                      <td>{item.data.movieName}</td>
                      <td>{item.data.date}</td>
                      <td>{item.data.rating}</td>
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
                          className=""
                          onClick={() => deleteFromRatingList(item.id)}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))
                : state.list?.map((item) => (
                    <tr>
                      <th></th>
                      <td>{item.data.movieName}</td>
                      <td>{item.data.date}</td>
                      <td>{item.data.rating}</td>
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
                          className=""
                          onClick={() => deleteFromRatingList(item.id)}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!state.list.length ? "No results" : ""}
        </div>
      ) : (
        <div>Nothing here</div>
      )}
    </div>
  );
}

export default RatingList;
