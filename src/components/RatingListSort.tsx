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

function RatingListSort({
  setRatingList,
  setLoading,
  rateSort,
  onFilterChange,
}) {
  const handleNameAscend = async () => {
    try {
      const ratinglistRef = collection(db, "ratingslist");
      const first = query(
        ratinglistRef,
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

      setRatingList(movielistItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleNameDescend = async () => {
    try {
      const ratinglistRef = collection(db, "ratingslist");
      const first = query(
        ratinglistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("movieName", "desc"),
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

      setRatingList(movielistItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDateAscend = async () => {
    try {
      const movielistRef = collection(db, "ratingslist");
      const first = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("date"),
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

      setRatingList(movielistItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDateDescend = async () => {
    try {
      const ratinglistRef = collection(db, "ratingslist");
      const first = query(
        ratinglistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("date", "desc"),
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

      setRatingList(movielistItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRatingAscend = async () => {
    try {
      const ratinglistRef = collection(db, "ratingslist");
      const first = query(
        ratinglistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("rating"),
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

      setRatingList(movielistItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRatingDescend = async () => {
    try {
      const movielistRef = collection(db, "ratingslist");
      const first = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("rating", "desc"),
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

      setRatingList(movielistItems);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <select
        name=""
        id=""
        onChange={onFilterChange}
        className="select select-bordered select-sm mr-3"
        data-theme="halloween"
      >
        {/* <option value="" onClick={handleDateDescend}>
          Date (descending)
        </option>
        <option value="" onClick={handleDateAscend}>
          Date (ascending)
        </option>
        <option value="" onClick={handleNameAscend}>
          Name (ascending)
        </option>
        <option value="" onClick={handleNameDescend}>
          Name (descending)
        </option>
        <option value="" onClick={handleRatingAscend}>
          Rating (ascending)
        </option>
        <option value="" onClick={handleRatingDescend}>
          Rating (descending)
        </option> */}

        <option selected={rateSort == "NEW" ? true : false}>NEW</option>
        <option selected={rateSort == "OLD" ? true : false}>OLD</option>
        <option selected={rateSort == "NAME ASC" ? true : false}>
          NAME ASC
        </option>
        <option selected={rateSort == "NAME DESC" ? true : false}>
          NAME DESC
        </option>
        <option selected={rateSort == "RATING ASC" ? true : false}>
          RATING ASC
        </option>
        <option selected={rateSort == "RATING DESC" ? true : false}>
          RATING DESC
        </option>
        <option selected={rateSort == "FINISHED ASC" ? true : false}>
          FINISHED ASC
        </option>
        <option selected={rateSort == "FINISHED DESC" ? true : false}>
          FINISHED DESC
        </option>
      </select>
    </div>
  );
}

export default RatingListSort;
