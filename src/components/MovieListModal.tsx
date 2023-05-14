import { useState } from "react";
import { auth, db } from "../../firebase.config";
import { doc, addDoc, collection, setDoc } from "firebase/firestore";

interface movieInfo {
  movieName: string;
}

function MovieListModal({ fetchMovieList }) {
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
    };

    await addDoc(collection(db, "movieslist"), formDataCopy);

    fetchMovieList();
  };

  const handleOpen = () => {
    setIsChecked(true);
  };

  const handleClose = () => {
    setIsChecked(false);
  };

  return (
    <div>
      <label htmlFor="my-modal-4" className="btn" onClick={handleOpen}>
        Add Movie to List
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
            <h1>Add a Movie</h1>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={handleOnChange}
              value={movieName}
              id="movieName"
            />
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

export default MovieListModal;
