type MovieListSortProps = {
  sort: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function MovieListSort({ sort, onFilterChange }: MovieListSortProps) {
  return (
    <div>
      <select
        name=""
        id=""
        onChange={onFilterChange}
        className="select select-bordered select-sm mr-3 lg:text-lg"
        data-theme="halloween"
      >
        <option selected={sort == "NEWEST" ? true : false}>NEWEST</option>
        <option selected={sort == "OLDEST" ? true : false}>OLDEST</option>
        <option selected={sort == "NAME ASC" ? true : false}>NAME ASC</option>
        <option selected={sort == "NAME DESC" ? true : false}>NAME DESC</option>
      </select>
    </div>
  );
}

export default MovieListSort;
