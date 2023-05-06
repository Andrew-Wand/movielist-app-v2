import { Link } from "react-router-dom";

const MobileNavbar = (): JSX.Element => {
  return (
    <nav className="flex justify-between m-10 lg:hidden">
      <div>
        <Link to="/">List</Link>
      </div>
      <div>
        <Link to="/rating-list">Ratings</Link>
      </div>
      <div>
        <Link to="/spin">Spin</Link>
      </div>

      {/* When user is signed in */}
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link to="/profile" className="justify-between">
              Profile
            </Link>
          </li>

          <li>
            <Link to="/sign-in">Sign In</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MobileNavbar;
