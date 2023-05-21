import { useEffect } from "react";

function ProfileStats({ fetchMovielist, loading, movielist }) {
  useEffect(() => {
    fetchMovielist();
  }, [loading]);

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow">
      <div className="stat">
        <div className="stat-title">Movie List to Watch</div>
        {/* {movielist?.map((item) => (
          <div className="stat-value">{item.length}</div>
        ))} */}
        <div className="stat-value">{movielist?.length}</div>
      </div>
    </div>
  );
}

export default ProfileStats;
