import { Link } from "react-router-dom";
import { auth } from "../../firebase.config";
import { useState } from "react";

const Navbar = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    setOpen(!open);
  };

  return (
    <nav className="m-10 hidden lg:flex justify-between">
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
      <div
        className={
          open ? "dropdown dropdown-end dropdown-open" : "dropdown dropdown-end"
        }
        onClick={openMenu}
      >
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          {auth.currentUser ? (
            <li>
              <Link to="/profile" className="justify-between">
                Profile
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
