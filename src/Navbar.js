import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Hamburger from "./Hamburger";
import Logout from "./pages/Logout";

const Navbar = () => {
  const params = useParams();
  const Navigate = useNavigate();
  const logout = (e) => {
    e.preventDefault();
    console.log("Logout");

    localStorage.clear();
    Navigate("/");
  };

  return (
    <div className="card-text-center">
      if({params.Id})
      {
        <>
        <Hamburger></Hamburger>
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs"></ul>
          </div>
          <div>
            <Link
              to="/"
              onClick={() => {
                logout();
              }}
            >
              <Logout className="logout"></Logout>
            </Link>
          </div>
        </>
      }
      else
      {
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs"></ul>
        </div>
      }
    </div>
  );
};

export default Navbar;
