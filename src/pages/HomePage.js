import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Project from "./Project";
import Holiday from "./Holiday";
import ProjectManager from "./ProjectManager";
import { Container, Row } from "react-bootstrap";

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState(null);

  return (
    <>
      <div className="card-header">
        <Navbar></Navbar>
      </div>
      <Container>
        <Row>
          <div className="head">
            <ul className="navbar nav nav-tabs card-header-tabs">
              <li
                className="nav-item"
                onClick={(e) => {
                  let elements = e.target.parentElement.children;
                  console.log(elements);
                  let i = 0;
                  while (i < elements.length) {
                    elements[i].style = "border:black ";
                    i++;
                  }
                  e.target.style = "border-bottom:solid black";
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
                    elements[i].style = "border:black";
                    i++;
                  }
                  e.target.style = "border-bottom:solid black";
                  setSelectedTab("Calendar");
                }}
              >
                Holidays
              </li>
              {localStorage.getItem("role") === "4" ? (
                <li
                  className="nav-item"
                  onClick={(e) => {
                    let elements = e.target.parentElement.children;
                    let i = 0;
                    while (i < elements.length) {
                      elements[i].style = "border:black";
                      i++;
                    }
                    e.target.style = "border-bottom:solid black";
                    setSelectedTab("ProjectManager");
                  }}
                >
                  ProjectManagers
                </li>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </Row>
        {selectedTab === "Calendar" ? (
          
            <Holiday></Holiday>
          
        ) : selectedTab === "ProjectManager" ? (
          <Row>
            <ProjectManager></ProjectManager>
          </Row>
        ) : (
          <Row>
            <Project></Project>
          </Row>
        )}
      </Container>
    </>
  );
};

export default HomePage;
