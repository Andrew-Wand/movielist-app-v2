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

  return (
    <div>
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
              {ratinglist?.map((item) => (
                <tr>
                  <th></th>
                  <td>{item.data.movieName}</td>
                  <td>{item.data.date}</td>
                  <td>{item.data.rating}</td>
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

export default RatingList;
