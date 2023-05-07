function MovieListModal() {
  // const addMovie = () => {};

  return (
    <div>
      <label htmlFor="my-modal-4" className="btn">
        open modal
      </label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label
        htmlFor="my-modal-4"
        className="modal modal-middle sm:modal-middle cursor-pointer"
      >
        <label className="modal-box relative">
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <form>
            <h1>Add a Movie</h1>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
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
