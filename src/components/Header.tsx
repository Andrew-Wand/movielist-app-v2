import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase.config";
function Header() {
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
    <header>
      <div className="text-6xl font-['Dancing_Script']">
        <h1>Movie Night</h1>
      </div>
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
    </header>
  );
}

export default Header;
