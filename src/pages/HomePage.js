import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Project from "./Project";
import Holiday from "./Holiday";
import ProjectManager from "./ProjectManager";

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState(null);

  return (
    <>
      <div className="card-text-center">
        <div className="card-header">
          <Navbar></Navbar>
          <div className="head">
            <ul className="navbar nav nav-tabs card-header-tabs">
              <li
                className="nav-item"
                onClick={(e) => {
                  let elements = e.target.parentElement.children;
                  console.log(elements);
                  let i = 0;
                  while (i < elements.length) {
                    elements[i].style = "border:none";
                    i++;
                  }
                  e.target.style = "border-bottom:solid red";
                  setSelectedTab("Project");
                }}
              >
                Projects
              </li>
              <li
                className="nav-item"
                onClick={(e) => {
                  let elements = e.target.parentElement.children;
                  let i = 0;
                  while (i < elements.length) {
                    elements[i].style = "border:none";
                    i++;
                  }
                  e.target.style = "border-bottom:solid red";
                  // holidayGrouping(holidayList);
                  setSelectedTab("Calendar");
                }}
              >
                Holidays
              </li>
              <li
                className="nav-item"
                onClick={(e) => {
                  let elements = e.target.parentElement.children;
                  let i = 0;
                  while (i < elements.length) {
                    elements[i].style = "border:none";
                    i++;
                  }
                  e.target.style = "border-bottom:solid red";
                  setSelectedTab("ProjectManager");
                }}
              >
                ProjectManagers
              </li>
            </ul>
          </div>
        </div>

        <div className="card-body">
          {selectedTab === "Calendar" ? (
            <Holiday></Holiday>
          ) : selectedTab === "ProjectManager" && localStorage.getItem("role")==='4'? (
            <ProjectManager></ProjectManager>
          ) : (
            <Project></Project>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;