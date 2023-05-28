import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

const MobileNavbar = (): JSX.Element => {
  const navList = [
    { id: 1, title: "List", toLink: "/" },
    { id: 2, title: "Ratings", toLink: "/rating-list" },
    { id: 3, title: "Spin", toLink: "/spin" },
  ];

  const [activeTab, setActiveTab] = useState(1);

  const handleClick = (row) => {
    if (row.id === 1) {
      setActiveTab(row.id);
    }
    if (row.id === 2) {
      setActiveTab(row.id);
    }
    if (row.id === 3) {
      setActiveTab(row.id);
    }
  };

  return (
    <nav className="lg:hidden font-['Staatliches'] list-none" data-theme="aqua">
      <div className="btm-nav ">
        {navList.map((list) => (
          <Link
            to={list.toLink}
            key={list.id}
            className={
              list.id === activeTab ? "active btm-nav-label" : "btm-nav-label"
            }
            onClick={() => handleClick(list)}
          >
            {list.id === 1 ? (
              <svg
                width="32px"
                height="32px"
                stroke-width="1.9"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
              >
                <path
                  d="M8 6h12M4 6.01l.01-.011M4 12.01l.01-.011M4 18.01l.01-.011M8 12h12M8 18h12"
                  stroke="#fff"
                  stroke-width="1.9"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            ) : list.id === 2 ? (
              <svg
                width="28px"
                height="28px"
                stroke-width="1.6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
              >
                <path
                  d="M15 21H9v-8.4a.6.6 0 01.6-.6h4.8a.6.6 0 01.6.6V21zM20.4 21H15v-2.9a.6.6 0 01.6-.6h4.8a.6.6 0 01.6.6v2.3a.6.6 0 01-.6.6zM9 21v-4.9a.6.6 0 00-.6-.6H3.6a.6.6 0 00-.6.6v4.3a.6.6 0 00.6.6H9zM10.806 5.113l.909-1.927a.312.312 0 01.57 0l.91 1.927 2.032.311c.261.04.365.376.176.568l-1.47 1.5.347 2.118c.044.272-.228.48-.462.351l-1.818-1-1.818 1c-.233.128-.506-.079-.462-.351l.347-2.118-1.47-1.5c-.19-.192-.085-.528.175-.568l2.034-.31z"
                  stroke="#fff"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            ) : list.id === 3 ? (
              <svg
                width="28px"
                height="28px"
                stroke-width="1.6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="#fff"
              >
                <path
                  d="M21.888 13.5C21.164 18.311 17.013 22 12 22 6.477 22 2 17.523 2 12S6.477 2 12 2c4.1 0 7.625 2.468 9.168 6"
                  stroke="#fff"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M17 8h4.4a.6.6 0 00.6-.6V3"
                  stroke="#fff"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            ) : (
              ""
            )}
            <span>{list.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
