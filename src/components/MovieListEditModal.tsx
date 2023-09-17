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
    <>
      <div
        className="btn lg:btn-lg lg:mr-5 mr-2 lg:tooltip"
        data-tip="Edit"
        onClick={() => {
          if (document) {
            (
              document.getElementById("my_modal_5") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        <button className="lg:text-4xl text-3xl lg:mt-3 ">
          <BiEdit />
        </button>
        <dialog
          id="my_modal_5"
          className="modal-bottom sm:modal-middle bg-transparent"
        >
          <div className="w-200px h-400px lg:p-20 bg-[#3F4C5C] p-10 rounded-lg shadow-xl">
            {/* <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p> */}
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

                  <button className="btn text-lg">Close</button>
                </form>
                <button
                  type="submit"
                  className="btn bg-[#3b8ac4] text-black text-lg"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </>

    // <div>
    //   <div className="lg:tooltip" data-tip="Edit">
    //     <label
    //       htmlFor="my-modal-4"
    //       className="lg:text-4xl text-3xl cursor-pointer"
    //       onClick={handleOpen}
    //     >
    //       <BiEdit />
    //     </label>
    //   </div>

    //   <input
    //     type="checkbox"
    //     id="my-modal-4"
    //     className="modal-toggle"
    //     checked={isChecked}
    //   />
    //   <label
    //     htmlFor="my-modal-4"
    //     className="modal modal-middle sm:modal-middle cursor-pointer bg-transparent"
    //     data-theme="dracula"
    //   >
    //     <label className="modal-box relative">
    //       <label
    //         htmlFor="my-modal-4"
    //         className="btn btn-sm btn-circle absolute right-2 top-2"
    //         onClick={handleClose}
    //       >
    //         ✕
    //       </label>
    //       <form onSubmit={addMovieEdit}>
    //         <h1>Edit Movie</h1>
    //         <input
    //           type="text"
    //           placeholder="Type here"
    //           className="input input-bordered w-full max-w-xs"
    //           onChange={handleOnChange}
    //           value={movieName}
    //           id="movieName"
    //         />
    //         <div className="modal-action">
    //           <button
    //             type="submit"
    //             className="btn bg-[#3b8ac4] text-black text-lg"
    //           >
    //             Add
    //           </button>
    //         </div>
    //       </form>
    //     </label>
    //   </label>
    // </div>
  );
}

export default MovieListEditModal;
