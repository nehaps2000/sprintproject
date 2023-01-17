import React from "react";
import { Link } from "react-router-dom";
import Home from "../custom-icons/Home";
import { slide as Menu } from "react-burger-menu";
import Leave from "../custom-icons/Leave";
import Work from "../custom-icons/Work";
import Sprint from "../custom-icons/Sprint";
const Hamburger = () => {
  let projectId = localStorage.getItem("id");
 
  return (
    <>
    
      <div className="Hamburger">
        <Menu>
          <Link to="/project" >
            <Home  className="hamburger_icon"></Home>
            Home
          </Link>
          <Link to={`/${projectId}/ProjectSettings`} defaultValue>
            <Work className="hamburger_icon"></Work>
            Project Settings
          </Link>

          <Link to={`/${projectId}/Sprint/SearchSprint`}>
            <Sprint className="hamburger_icon"></Sprint>
            Sprint Settings
          </Link>
          <Link to={`/${projectId}/Leave/Getleave`}>
            <Leave className="hamburger_icon"></Leave>
            Leave Settings
          </Link>
        </Menu>
      </div>
    </>
  );
};

export default Hamburger;
