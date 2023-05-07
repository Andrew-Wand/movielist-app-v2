import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";
import { useState } from "react";

const MobileNavbar = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  const [displayMenuStyle, setdisplayMenuStyle] = useState("");

  const navigate = useNavigate();

  const openMenu = () => {
    setOpen(!open);
    if (open) {
      setdisplayMenuStyle("");
    } else {
      setdisplayMenuStyle("none");
    }
    return open;
  };

  const onLogout = () => {
    if (auth.currentUser) {
      auth.signOut();
      navigate("/sign-in");
    }
  };

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
      <div className="dropdown dropdown-end" onClick={openMenu}>
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          style={{ display: displayMenuStyle }}
        >
          {auth.currentUser ? (
            <li>
              <Link to="/profile" className="justify-between">
                Profile
              </Link>
              <a onClick={onLogout}>Logout</a>
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

export default MobileNavbar;
