type RatingListSortProps = {
  rateSort: string;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function RatingListSort({ rateSort, onFilterChange }: RatingListSortProps) {
  return (
    <div>
      <select
        name=""
        id=""
        onChange={onFilterChange}
        className="select select-bordered select-sm mr-3 lg:text-lg lg:select-md lg:mr-0"
        data-theme="halloween"
      >
        <option selected={rateSort == "NEW" ? true : false}>NEW</option>
        <option selected={rateSort == "OLD" ? true : false}>OLD</option>
        <option selected={rateSort == "NAME ASC" ? true : false}>
          NAME ASC
        </option>
        <option selected={rateSort == "NAME DESC" ? true : false}>
          NAME DESC
        </option>
        <option selected={rateSort == "RATING ASC" ? true : false}>
          RATING ASC
        </option>
        <option selected={rateSort == "RATING DESC" ? true : false}>
          RATING DESC
        </option>
        <option selected={rateSort == "FINISHED ASC" ? true : false}>
          FINISHED ASC
        </option>
        <option selected={rateSort == "FINISHED DESC" ? true : false}>
          FINISHED DESC
        </option>
      </select>
    </div>
  );
}

export default RatingListSort;
