import React from "react";
import { Link } from "react-router-dom";
import Home from "../custom-icons/Home";
import { slide as Menu } from "react-burger-menu";

const Hamburger = () => {
  let projectId=localStorage.getItem("id")
  return (
    <>
      <div>
        <div className="Hamburger">
          <Menu>
            <Link to="/project">
              <Home className="home"></Home>
              Home
            </Link>
            <Link
              to={`/${projectId}/ProjectSettings`}
              defaultValue
            >
              Project Settings
            </Link>
            <Link to={`/${projectId}/Sprint/SearchSprint`}>
              Sprint Settings
            </Link>
            <Link to={`/Leave/Getleave`}>Leave Settings</Link>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default Hamburger;
