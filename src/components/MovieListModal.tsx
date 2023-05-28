import { useState } from "react";
import { auth, db } from "../../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface movieInfo {
  movieName: string;
}

type movieProps = {
  fetchMovieList: (params: void) => void;
};

function MovieListModal({ fetchMovieList }: movieProps) {
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState<movieInfo>({
    movieName: "",
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
  const addMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChecked(false);

    const formDataCopy = {
      ...formData,
      userRef: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "movieslist"), formDataCopy);

    fetchMovieList();
    setFormData({
      movieName: "",
    });
  };

  const handleOpen = () => {
    setIsChecked(true);
  };

  const handleClose = () => {
    setIsChecked(false);
  };

  return (
    <div>
      <label
        htmlFor="my-modal-4"
        className="btn text-4xl rounded-full"
        onClick={handleOpen}
      >
        +
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
          <form onSubmit={addMovie}>
            <h1 className="text-3xl ml-2 mb-5">Add a Movie</h1>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={handleOnChange}
              value={movieName}
              id="movieName"
            />
            <div className="modal-action">
              <button type="submit" className="btn text-lg">
                Add
              </button>
            </div>
          </form>
        </label>
      </label>
    </div>
  );
}

export default MovieListModal;
