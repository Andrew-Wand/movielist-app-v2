import MovieListEditModal from "../components/MovieListEditModal";
import RatingListModal from "../components/RatingListModal";
import { DocumentData } from "firebase/firestore";

import { BsTrashFill } from "react-icons/bs";

type Props = {
  movielist: movie[];
  list: [];
  search: "";
  fetchMovielist: () => void;
  deleteFromMovieList: (params: string) => void;
};
interface movie {
  data: DocumentData;
  id: string;
}

function MovieListCard({
  movielist,
  list,
  search,
  deleteFromMovieList,
  fetchMovielist,
}: Props) {
  return (
    <div className="flex flex-col justify-center mx-6 font-['Roboto'] mt-10">
      {search === ""
        ? movielist?.map((movieItem: movie) => (
            <div className="flex justify-between bg-[#172131] mb-7 rounded-xl shadow-lg p-5">
              <div>
                <p className="lg:text-2xl font-bold truncate lg:mt-14 mt-10 text-xl lg:ml-5">
                  {movieItem.data.movieName}
                </p>
              </div>

              <div className="rounded-lg flex flex-col items-end lg:mr-5">
                <div className="flex lg:mr-4 ">
                  <MovieListEditModal
                    movieItemName={movieItem.data.movieName}
                    fetchMovielist={fetchMovielist}
                    movieRatingId={movieItem.id}
                  />

                  <div className="lg:tooltip" data-tip="Delete">
                    <button
                      className="lg:text-3xl btn lg:btn-lg text-2xl bg-[#172131] text-[#f2f4f8]"
                      onClick={() => deleteFromMovieList(movieItem.id)}
                    >
                      <BsTrashFill />
                    </button>
                  </div>
                </div>
                <div className="">
                  {/* <span className="lg:mr-2 mr-3 normal-case text-[#f2f4f8]">
                    Rate
                  </span> */}
                  <RatingListModal
                    movieRatingId={movieItem.id}
                    fetchMovielist={fetchMovielist}
                  />
                </div>
              </div>
            </div>
          ))
        : list?.map((movieItem: movie) => (
            <div className="flex justify-between bg-[#172131] mb-7 rounded-xl shadow-lg p-5">
              <div>
                <p className="lg:text-2xl text-xl font-bold truncate lg:mt-14 mt-10 lg:ml-5">
                  {movieItem.data.movieName}
                </p>
              </div>

              <div className="rounded-lg flex flex-col items-end lg:mr-5">
                <div className="flex lg:mr-4">
                  <div className="">
                    <MovieListEditModal
                      movieItemName={movieItem.data.movieName}
                      fetchMovielist={fetchMovielist}
                      movieRatingId={movieItem.id}
                    />
                  </div>

                  <div className="lg:tooltip " data-tip="Delete">
                    <button
                      className="lg:text-3xl btn lg:btn-lg text-2xl bg-[#172131] text-[#f2f4f8]"
                      onClick={() => deleteFromMovieList(movieItem.id)}
                    >
                      <BsTrashFill />
                    </button>
                  </div>
                </div>
                <div>
                  <RatingListModal
                    movieRatingId={movieItem.id}
                    fetchMovielist={fetchMovielist}
                  />
                </div>
              </div>
            </div>
          ))}
    </div>
  );
}

export default MovieListCard;
