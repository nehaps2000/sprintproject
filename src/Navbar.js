import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./pages/Logout";

const Navbar = () => {
  const Navigate = useNavigate();
  const logout = (e) => {
 
    console.log("Logout");

    localStorage.clear();
    Navigate("/");

  };

  return (
    <div className="card-text-center">
        <>
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
     
    </div>
  );
};

export default Navbar;
