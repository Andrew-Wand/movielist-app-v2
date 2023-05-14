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
} from "firebase/firestore";
import Loading from "./Loading";

type RateProps = {
  movieRatingId: string;
};

interface movieInfo {
  movieName: string;
  date: string;
  rating: string;
}

function RatingListModal({ movieRatingId }: RateProps) {
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
    setIsChecked(false);
  };

  const handleOpen = () => {
    setIsChecked(true);
    fetchMovielist();
  };

  const handleClose = () => {
    setIsChecked(false);
  };

  // Fetch movie name after clicking rate button
  const [movielist, setmovieList] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchMovielist = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const q = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid)
        // where(firebase.firestore.FieldPath.documentId(), "==", movieRatingId)
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

      setmovieList(filteredNameList);
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
        <label className="modal-box relative">
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </label>
          <form onSubmit={addRating} className="flex-col">
            <h1>Rate This Movie</h1>
            <label htmlFor="movieName">Movie Name:</label>
            {movielist?.map((movie) => (
              <input
                type="text"
                placeholder="Type here"
                className="input input-ghost
              w-full max-w-xs"
                // onChange={handle}
                value={movie.data.movieName}
                id="movieName"
                // disabled={true}

                // {movie.data.movieName}
              />
            ))}

            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleOnChange}
            />
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
