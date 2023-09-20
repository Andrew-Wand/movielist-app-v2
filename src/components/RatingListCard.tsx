import RatingListEditModal from "./RatingListEditModal";
import { DocumentData } from "firebase/firestore";
import { BsTrashFill } from "react-icons/bs";

type Props = {
  ratinglist: rate[];
  list: [];
  search: "";
  fetchRatingList: () => void;
  deleteFromRatingList: (params: string) => void;
};

interface rate {
  data: DocumentData;
  id: string;
}

const RatingListCard = ({
  ratinglist,
  list,
  search,
  fetchRatingList,
  deleteFromRatingList,
}: Props) => {
  return (
    <div className="flex flex-col justify-center mx-6 font-['Roboto'] mt-6">
      {search === ""
        ? ratinglist?.map((item: rate) => (
            <div className="flex justify-between bg-[#172131] mb-7 rounded-xl shadow-lg py-5 px-2 ">
              <div className="truncate">
                <p className="lg:text-2xl font-bold truncate text-2xl lg:ml-1 ml-1 lg:mb-2">
                  {item.data.movieName}
                </p>
                <div className="stats bg-black/30 mt-5 rounded-md">
                  <div className="stat">
                    <div className="stat-title">Rating</div>
                    <div className="stat-value text-[28px]">
                      {item.data.rating} / 10
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg flex flex-col items-end lg:mr-5 justify-between">
                <div className="flex lg:mt-5 mt-14">
                  <RatingListEditModal
                    movieItemName={item.data.movieName}
                    movieItemDate={item.data.date}
                    movieItemRating={item.data.rating}
                    fetchRatingList={fetchRatingList}
                    movieRatingId={item.id}
                  />

                  <div className="lg:tooltip ml-3" data-tip="Delete">
                    <button
                      className="lg:text-3xl btn lg:btn-lg text-2xl bg-[#172131] text-[#f2f4f8]"
                      onClick={() => deleteFromRatingList(item.id)}
                    >
                      <BsTrashFill />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-thin mt-4 text-slate-300">
                  Finished - {item.data.date}
                </p>
              </div>
            </div>
          ))
        : list?.map((item: rate) => (
            <div className="flex justify-between bg-[#172131] mb-7 rounded-xl shadow-lg p-5">
              <div className="">
                <p className="lg:text-2xl font-bold truncate text-2xl lg:ml-5 ml-1">
                  {item.data.movieName}
                </p>
                <div className="stats bg-black/30 mt-5 rounded-md">
                  <div className="stat">
                    <div className="stat-title">Rating</div>
                    <div className="stat-value text-[28px]">
                      {item.data.rating} / 10
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg flex flex-col items-end lg:mr-5 justify-between">
                <div className="flex lg:mr-4 mt-14">
                  <RatingListEditModal
                    movieItemName={item.data.movieName}
                    movieItemDate={item.data.date}
                    movieItemRating={item.data.rating}
                    fetchRatingList={fetchRatingList}
                    movieRatingId={item.id}
                  />

                  <div className="lg:tooltip ml-3" data-tip="Delete">
                    <button
                      className="lg:text-3xl btn lg:btn-lg text-xl bg-[#172131] text-[#f2f4f8]"
                      onClick={() => deleteFromRatingList(item.id)}
                    >
                      <BsTrashFill />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-thin mt-4 text-slate-300">
                  Completed - {item.data.date}
                </p>
              </div>
            </div>
          ))}
    </div>
  );
};

export default RatingListCard;
