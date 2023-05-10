function RatingList() {
  return (
    <div className="overflow-x-auto p-2">
      <table className="table table-zebra table-compact w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Date</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th></th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          {/* row 2 */}
          <tr>
            <th></th>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          {/* row 3 */}
          <tr>
            <th></th>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RatingList;
