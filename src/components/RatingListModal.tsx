import { useState, useEffect } from "react";
import { auth, db } from "../../firebase.config";
import {
  doc,
  addDoc,
  collection,
  setDoc,
  where,
  getDocs,
  query,
  deleteDoc,
} from "firebase/firestore";
import Loading from "./Loading";

type RateProps = {
  movieRatingId: string;
  fetchMovielist: (params: any) => any;
};

interface movieInfo {
  movieName: string;
  date: string;
  rating: string;
}

function RatingListModal({ movieRatingId, fetchMovielist }: RateProps) {
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState<movieInfo>({
    movieName: "",
    date: "",
    rating: "1",
  });

  const { movieName, date, rating } = formData;

  // Handle getting input values
  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Handle submit of form
  const addRating = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataCopy = {
      ...formData,
      // movieName: getMovieName(),
      userRef: auth.currentUser?.uid,
    };

    await addDoc(collection(db, "ratingslist"), formDataCopy);
    await deleteDoc(doc(db, "movieslist", movieRatingId));
    fetchMovielist();
    setIsChecked(false);
  };

  const handleOpen = () => {
    setIsChecked(true);
    fetchMovieName();
  };

  const handleClose = () => {
    setIsChecked(false);
  };

  // Fetch movie name after clicking rate button
  const [ratinglist, setratingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchMovieName = async () => {
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

      const filteredNameList = movielistItems.filter(
        (doc) => doc.id == movieRatingId
      );

      const string = filteredNameList.map((doc) => {
        return doc.data.movieName;
      });

      setratingList(filteredNameList);
      setFormData((prevState) => ({
        ...prevState,
        movieName: string.toString(),
      }));

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <label htmlFor="my-modal-4" className="btn" onClick={handleOpen}>
        Rate
      </label>

      <input
        type="checkbox"
        id="my-modal-4"
        className="modal-toggle"
        checked={isChecked}
      />
      <label
        htmlFor="my-modal-4"
        className="modal modal-middle sm:modal-middle cursor-pointer"
      >
        <label className="modal-box relative overflow-x-hidden">
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </label>
          <form onSubmit={addRating} className="">
            <h1 className="text-center text-3xl underline m-5">
              Rate This Movie
            </h1>
            <div className="text-xl my-5">
              <label htmlFor="movieName">Movie Name:</label>
              {ratinglist?.map((movie) => (
                <input
                  type="text"
                  className="p input-ghost outline-none bg-transparent
               max-w-xs cursor-default ml-5"
                  value={movie.data.movieName}
                  id="movieName"
                  readOnly={true}
                  // disabled={true}
                />
              ))}
            </div>

            <div className="text-xl">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleOnChange}
                className="ml-5"
              />
            </div>

            <div className="text-xl w-6/12 mt-5">
              <label htmlFor="rating">Rating:</label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={rating}
                id="rating"
                onChange={handleOnChange}
              >
                <option disabled selected>
                  Select Rating
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn">
                Add
              </button>
            </div>
          </form>
        </label>
      </label>
    </div>
  );
}

export default RatingListModal;
