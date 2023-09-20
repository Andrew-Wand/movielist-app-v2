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
          className="cursor-pointer text-[#f2f4f8] btn mt-3 bg-[#86a6da] text-xl lg:text-2xl lg:btn-lg text-black p-2 shadow-lg lg:mr-3 lg:w-[190px] w-[130px] "
          onClick={handleOpen}
        >
          Rate
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
        <label className="modal-box relative overflow-x-hidden bg-[#182437]">
          <label
            htmlFor="my-modal-4"
            className="btn btn-md btn-circle absolute right-2 top-2 bg-[#172131]"
            onClick={handleClose}
          >
            ✕
          </label>
          <form onSubmit={addRating} className="">
            <h1 className="text-left text-3xl lg:text-4xl uppercase mt-10 font-bold">
              Rate This Movie
            </h1>
            <div className="divider"></div>
            <div className="text-xl my-5 flex">
              <label className="text-slate-300" htmlFor="movieName">
                Title:
              </label>
              {ratinglist?.map((movie: DocumentData) => (
                <input
                  type="text"
                  className="
               max-w-xs cursor-default ml-5 bg-transparent outline-none input-ghost truncate"
                  value={movie.data.movieName}
                  id="movieName"
                  readOnly={true}
                />
              ))}
            </div>

            <div className="text-xl">
              <label className="text-slate-300" htmlFor="date">
                Date:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={handleOnChange}
                className="ml-5 border-2 p-2 rounded-lg text-lg"
              />
            </div>

            <div className="text-xl w-6/12 mt-5 flex">
              <label className="mr-5" htmlFor="rating">
                Rating:
              </label>
              <select
                className="select select-bordered w-full max-w-xs select-sm"
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
                className="btn bg-[#86a6da] text-black text-lg"
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
