import { useState } from "react";
import { auth, db } from "../../firebase.config";
import { updateDoc, doc } from "firebase/firestore";
import { BiEdit } from "react-icons/bi";

interface movieInfo {
  movieName: string;
}

type movieProps = {
  movieItemName: string;
  fetchMovielist: () => void;
  movieRatingId: string;
};

function MovieListEditModal({
  movieItemName,
  fetchMovielist,
  movieRatingId,
}: movieProps) {
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState<movieInfo>({
    movieName: movieItemName,
  });

  const { movieName } = formData;

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
  const addMovieEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChecked(false);

    const formDataCopy = {
      ...formData,
      userRef: auth.currentUser?.uid,
    };

    const movieRef = doc(db, "movieslist", movieRatingId);

    await updateDoc(movieRef, formDataCopy);

    fetchMovielist();
  };

  const handleOpen = () => {
    setIsChecked(true);
  };

  const handleClose = () => {
    setIsChecked(false);
  };

  return (
    <div>
      <div className="lg:tooltip" data-tip="Edit">
        <label
          htmlFor="my-modal-4"
          className="text-3xl cursor-pointer"
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
        className="modal modal-middle sm:modal-middle cursor-pointer bg-transparent"
        data-theme="dracula"
      >
        <label className="modal-box relative">
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </label>
          <form onSubmit={addMovieEdit}>
            <h1>Edit Movie</h1>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={handleOnChange}
              value={movieName}
              id="movieName"
            />
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

export default MovieListEditModal;
