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

    const formDataCopy = {
      ...formData,
      userRef: auth.currentUser?.uid,
    };

    const movieRef = doc(db, "movieslist", movieRatingId);

    await updateDoc(movieRef, formDataCopy);

    fetchMovielist();
  };

  return (
    <>
      <div
        className="btn lg:btn-lg lg:mr-5 mr-2 lg:tooltip bg-[#5371a2] drop-shadow-lg"
        data-tip="Edit"
        onClick={() => {
          if (document) {
            (
              document.getElementById("my_modal_5") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        <button className="lg:text-4xl text-3xl lg:mt-3 text-[#f2f4f8] ">
          <BiEdit />
        </button>
        <dialog
          id="my_modal_5"
          className="modal-bottom sm:modal-middle bg-transparent"
        >
          <div className="w-200px h-400px lg:p-14 bg-[#182437] px-14 py-10 rounded-lg shadow-xl">
            <form onSubmit={addMovieEdit}>
              <h1 className="text-3xl mb-5 text-left">Edit Movie</h1>
              <div className="divider"></div>
              <label className="label">
                <span className="label-text font-light">Movie Title</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-lg input-bordered w-full max-w-xs mb-3"
                onChange={handleOnChange}
                value={movieName}
                id="movieName"
              />
              <div className="modal-action mb-5 justify-between">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}

                  <button className="btn text-lg bg-[#172131] text-[#f2f4f8]">
                    Close
                  </button>
                </form>
                <button
                  type="submit"
                  className="btn bg-[#86a6da] text-black text-lg"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
}

export default MovieListEditModal;
