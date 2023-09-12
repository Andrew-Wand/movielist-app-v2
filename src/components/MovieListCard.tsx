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
            <div className="flex justify-between bg-[#182635] mb-7 rounded-xl shadow-lg p-5">
              <div>
                <p className="text-2xl font-bold truncate mt-8 ">
                  {movieItem.data.movieName}
                </p>
              </div>

              <div className="rounded-lg flex flex-col items-end">
                <div className="flex">
                  <div className="">
                    <MovieListEditModal
                      movieItemName={movieItem.data.movieName}
                      fetchMovielist={fetchMovielist}
                      movieRatingId={movieItem.id}
                    />
                  </div>

                  <div className="lg:tooltip " data-tip="Delete">
                    <button
                      className="text-2xl mt-[.15rem] ml-6 mr-3"
                      onClick={() => deleteFromMovieList(movieItem.id)}
                    >
                      <BsTrashFill />
                    </button>
                  </div>
                </div>
                <div className="flex mt-5 bg-[#c2cbf5] text-2xl rounded-xl text-black p-2 shadow-lg">
                  <span className="mr-1">Rate</span>
                  <RatingListModal
                    movieRatingId={movieItem.id}
                    fetchMovielist={fetchMovielist}
                  />
                </div>
              </div>
            </div>
          ))
        : list?.map((movieItem: movie) => (
            <div className="flex justify-between bg-[#182635] mb-7 rounded-xl shadow-lg p-5">
              <div>
                <p className="text-2xl font-bold truncate mt-8 ">
                  {movieItem.data.movieName}
                </p>
              </div>

              <div className="rounded-lg flex flex-col items-end">
                <div className="flex">
                  <div className="">
                    <MovieListEditModal
                      movieItemName={movieItem.data.movieName}
                      fetchMovielist={fetchMovielist}
                      movieRatingId={movieItem.id}
                    />
                  </div>

                  <div className="lg:tooltip " data-tip="Delete">
                    <button
                      className="text-2xl mt-[.15rem] ml-6 mr-3"
                      onClick={() => deleteFromMovieList(movieItem.id)}
                    >
                      <BsTrashFill />
                    </button>
                  </div>
                </div>
                <div className="flex mt-5 bg-[#c2cbf5] text-2xl rounded-xl text-black p-2 shadow-lg">
                  <span className="mr-1">Rate</span>
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
