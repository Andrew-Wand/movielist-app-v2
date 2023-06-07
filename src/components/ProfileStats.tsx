import { DocumentData } from "firebase/firestore";
import { useEffect } from "react";

type ProfileStatsProps = {
  fetchMovielist: () => void;
  loading: boolean;
  movielist: DocumentData;
  fetchRatingList: () => void;
  ratingslist: DocumentData;
};

function ProfileStats({
  fetchMovielist,
  loading,
  movielist,
  fetchRatingList,
  ratingslist,
}: ProfileStatsProps) {
  useEffect(() => {
    fetchMovielist();
    fetchRatingList();
  }, [loading]);

  const ratingArray = ratingslist?.map((item: DocumentData) => {
    return parseInt(item.data.rating);
  });

  const calculateAverage = () => {
    const total = ratingArray?.reduce((acc: number, c: number) => acc + c, 0);
    return total / ratingArray?.length;
  };

  return (
    <div className=" ">
      <div className="stats stats-horizontal m-2 shadow-lg lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Total Movies To Watch</div>

          <div className="stat-value">{movielist?.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Rated Movies</div>

          <div className="stat-value">{ratingslist?.length}</div>
        </div>
      </div>
      <div className="stats stats-horizontal m-2 shadow-lg lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Average Rating</div>

          <div className="stat-value">{calculateAverage()}</div>
        </div>
      </div>
    </div>
  );
}

export default ProfileStats;
