import { useEffect } from "react";

function ProfileStats({
  fetchMovielist,
  loading,
  movielist,
  fetchRatingList,
  ratingslist,
}) {
  useEffect(() => {
    fetchMovielist();
    fetchRatingList();
  }, [loading]);

  return (
    <div className="stats stats-horizontal m-2 shadow-lg lg:stats-horizontal shadow">
      <div className="stat">
        <div className="stat-title">Total Movies To Watch</div>
        {/* {movielist?.map((item) => (
          <div className="stat-value">{item.length}</div>
        ))} */}
        <div className="stat-value">{movielist?.length}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Total Rated Movies</div>

        <div className="stat-value">{ratingslist?.length}</div>
      </div>
    </div>
  );
}

export default ProfileStats;
