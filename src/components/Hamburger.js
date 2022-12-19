import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Home from "../custom-icons/Home";
import { slide as Menu } from "react-burger-menu";

const Hamburger = () => {
  const params = useParams();
  console.log(params.Id);
  return (
    <>
      <div>
      <div className="Hamburger">
          <Menu>
            <Link to="/project">
              <Home className="home"></Home>
              Home
            </Link>
            <Link id="projectsettings" className="menu-item1" to="#">
              Project Settings
            </Link>
            <Link to={`/${params.Id}/Sprint/SearchSprint`}>Sprint Settings</Link>
            <Link to={`/${params.Id}/Story/SearchStory`}>Story BackLog</Link>
          </Menu>
        </div>
      </div>
    </>
  );
};

export default Hamburger;
