import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Home from "../custom-icons/Home";
import { slide as Menu } from "react-burger-menu";
import Leave from "../custom-icons/Leave";
import Work from "../custom-icons/Work";
import Sprint from "../custom-icons/Sprint";
import { useLocation } from "react-router-dom";

const Hamburger = () => {
  const [activeLink, setActiveLink] = useState();
  let projectId = localStorage.getItem("id");
  let sprintId = localStorage.getItem("sprintId");
  let location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setActiveLink(path);
  }, [location]);

  return (
    <>
      <div className="Hamburger">
        <Menu>
          <Link
            to="/project"
            className={`ham-link ${activeLink === "home" ? "active" : ""}`}
          >
            <Home className="hamburger_icon"></Home>
            Home
          </Link>
          <Link
            to={`/${projectId}/ProjectSettings`}
            className={`ham-link ${
              activeLink === `/${projectId}/ProjectSettings` ? "active" : ""
            }`}
          >
            <Work className="hamburger_icon"></Work>
            Project Settings
          </Link>

          <Link
            to={`/${projectId}/Sprint/SearchSprint`}
            className={`ham-link ${
              activeLink === `/${projectId}/Sprint/SearchSprint` ||
              activeLink === `/${projectId}/Story/SearchStory/${sprintId}` ||
              activeLink === `/${sprintId}/ListedStory`
                ? "active"
                : ""
            }`}
          >
            <Sprint className="hamburger_icon"></Sprint>
            Sprint Settings
          </Link>
          <Link
            to={`/${projectId}/Leave/Getleave`}
            className={`ham-link ${
              activeLink === `/${projectId}/Leave/Getleave` ? "active" : ""
            }`}
            onClick={() => setActiveLink("Leaves")}
          >
            <Leave className="hamburger_icon"></Leave>
            Leave Settings
          </Link>
        </Menu>
      </div>
    </>
  );
};

export default Hamburger;
