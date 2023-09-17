import { useState } from "react";
import { auth, db } from "../../firebase.config";
import {
  doc,
  addDoc,
  collection,
  where,
  getDocs,
  query,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { AiFillStar } from "react-icons/ai";
import { DocumentData } from "firebase/firestore/lite";

type RateProps = {
  movieRatingId: string;
  fetchMovielist: () => void;
};

interface movieInfo {
  movieName: string;
  date: string;
  rating: string;
}

interface RatingListData {
  data: DocumentData;
  id: string;
}

function RatingListModal({ movieRatingId, fetchMovielist }: RateProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [ratinglist, setratingList] = useState<RatingListData[]>([]);
  const [formData, setFormData] = useState<movieInfo>({
    movieName: "",
    date: "",
    rating: "1",
  });

  const { date, rating } = formData;

  // Handle getting input values
  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
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
      userRef: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
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

  const fetchMovieName = async () => {
    try {
      const movielistRef = collection(db, "movieslist");
      const q = query(
        movielistRef,
        where("userRef", "==", auth.currentUser?.uid)
      );

      const querySnap = await getDocs(q);

      const movielistItems: RatingListData[] = [];

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="lg:tooltip lg:mt-1" data-tip="Rate">
        <label
          htmlFor="my-modal-4"
          className="cursor-pointer text-3xl"
          onClick={handleOpen}
        >
          <AiFillStar />
        </label>
      </div>

      <input
        type="checkbox"
        id="my-modal-4"
        className="modal-toggle"
        checked={isChecked}
      />
      <label
        htmlFor="my-modal-4"
        className="modal modal-middle sm:modal-middle cursor-pointer bg-transparent"
        data-theme="dracula"
      >
        <label className="modal-box relative overflow-x-hidden">
          <label
            htmlFor="my-modal-4"
            className="btn btn-md btn-circle absolute right-2 top-2"
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
              {ratinglist?.map((movie: DocumentData) => (
                <input
                  type="text"
                  className="p input-ghost outline-none bg-transparent
               max-w-xs cursor-default ml-5"
                  value={movie.data.movieName}
                  id="movieName"
                  readOnly={true}
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
                className="ml-5 border-2 p-2"
              />
            </div>

            <div className="text-xl w-6/12 mt-5">
              <label className="mr-5" htmlFor="rating">
                Rating:
              </label>
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
              <button
                type="submit"
                className="btn bg-[#3b8ac4] text-black text-lg"
              >
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
