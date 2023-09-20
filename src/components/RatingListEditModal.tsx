import { useState } from "react";
import { auth, db } from "../../firebase.config";
import { doc, updateDoc } from "firebase/firestore";

import { BiEdit } from "react-icons/bi";

type RateProps = {
  movieRatingId: string;
  fetchRatingList: () => void;
  movieItemName: string;
  movieItemDate: string;
  movieItemRating: string;
};

interface movieInfo {
  movieName: string;
  date: string;
  rating: string;
}

function RatingListEditModal({
  movieItemName,
  movieItemDate,
  movieItemRating,
  fetchRatingList,
  movieRatingId,
}: RateProps) {
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState<movieInfo>({
    movieName: movieItemName,
    date: movieItemDate,
    rating: movieItemRating,
  });

  const { movieName, date, rating } = formData;

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
  const addRatingEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataCopy = {
      ...formData,
      userRef: auth.currentUser?.uid,
    };
    const movieRef = doc(db, "ratingslist", movieRatingId);

    await updateDoc(movieRef, formDataCopy);
    fetchRatingList();
    setIsChecked(false);
  };

  const handleOpen = () => {
    setIsChecked(true);
  };

  const handleClose = () => {
    setIsChecked(false);
  };
  return (
    <div className="">
      <div className="lg:tooltip" data-tip="Edit">
        <label
          htmlFor="my-modal-4"
          className="lg:text-4xl btn lg:btn-lg text-3xl bg-[#172131] text-[#f2f4f8] bg-[#5371a2]"
          onClick={handleOpen}
        >
          <BiEdit />
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
        className="modal modal-middle sm:modal-middle cursor-pointer"
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
          <form onSubmit={addRatingEdit} className="">
            <h1 className="text-left text-3xl mt-10">Edit Movie</h1>
            <div className="divider"></div>
            <div className="text-xl my-6">
              <label htmlFor="movieName">Title</label>
              <input
                type="text"
                className="max-w-xs cursor-default ml-5 input input-bordered text-xl"
                value={movieName}
                id="movieName"
                onChange={handleOnChange}
              />
            </div>

            <div className="text-xl my-6">
              <label htmlFor="date">Date</label>
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
                Rate
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

export default RatingListEditModal;
