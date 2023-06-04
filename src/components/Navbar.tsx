import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = (): JSX.Element => {
  const lists = [
    { id: 1, title: "List", toLink: "/" },
    { id: 2, title: "Ratings", toLink: "/rating-list" },
    { id: 3, title: "Spin", toLink: "/spin" },
  ];

  const [activeTab, setActiveTab] = useState(1);

  const handleClick = (row: any) => {
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
    <nav className="m-10 hidden lg:block font-['Staatliches'] text-3xl mt-15 border-b-2 pb-8">
      <div className="list-none flex justify-center">
        {lists.map((list) => (
          <Link
            to={list.toLink}
            key={list.id}
            className="mt-[20px] mr-[75px] ml-[75px]"
          >
            <li
              className={
                list.id === activeTab ? "nav-link active-nav" : "nav-link"
              }
              onClick={() => handleClick(list)}
            >
              {list.title}
            </li>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
