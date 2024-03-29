import React from "react";
import { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import Project from "./Project";
import Holiday from "./Holiday";
import ProjectManager from "./ProjectManager";
import { Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState();
  let location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    setSelectedTab(path);
  }, [location]);

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
                className={`nav-link ${
                  selectedTab === "/project" ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedTab("/project");
                }}
              >
                Projects
              </li>
              <li
                className={`nav-link ${
                  selectedTab === "Calendar" ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedTab("Calendar");
                }}
              >
                Holidays
              </li>
              {localStorage.getItem("role") === "4" ? (
                <li
                  className={`nav-link ${
                    selectedTab === "ProjectManager" ? "active" : ""
                  }`}
                  onClick={() => {
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
