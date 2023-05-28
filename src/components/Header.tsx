import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase.config";
import { BsPersonCircle } from "react-icons/bs";
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
      <div className="text-6xl font-['Dancing_Script'] text-center m-5 flex justify-between border-b-2 border-gray-500">
        <h1 className="text-blue-500">Movie Night</h1>
        <div
          className="dropdown dropdown-end font-['sans-serif']"
          onClick={openMenu}
        >
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar text-4xl mt-3"
          >
            {/* <div className="w-12 rounded-full"> */}
            <BsPersonCircle />
            {/* </div> */}
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52"
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
      </div>
    </header>
  );
}

export default Header;
