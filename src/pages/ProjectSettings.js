import { useState, useEffect } from "react";
import Allocations from "./Allocations";
import Resources from "./Resources";
import Team from "./Team";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ProjectSettings = () => {
  const [selectedTab, setSelectedTab] = useState();
  const params = useParams();
  console.log(params.Id);
  let location = useLocation();

  useEffect(() => {
    setSelectedTab("Allocations");
  }, [location]);

  return (
    <>
      <div className="card-header">
        <Navbar></Navbar>
      </div>
      <Container>
        <Row>
          <ul className="navbar nav nav-tabs card-header-tabs">
            <li
              className={`nav-link ${
                selectedTab === "Allocations" ? "active" : ""
              }`}
              onClick={(e) => {
                setSelectedTab("Allocations");
              }}
            >
              Allocations
            </li>
            <li
              className={`nav-link ${
                selectedTab === "Resources" ? "active" : ""
              }`}
              onClick={(e) => {
                setSelectedTab("Resources");
              }}
            >
              Resources
            </li>
            <li
              className={`nav-link ${selectedTab === "Team" ? "active" : ""}`}
              onClick={(e) => {
                setSelectedTab("Team");
              }}
            >
              Team
            </li>
          </ul>

          {selectedTab === "Team" ? (
            <div className={window.location}>
              <Team></Team>
            </div>
          ) : selectedTab === "Resources" ? (
            <div>
              <Resources></Resources>
            </div>
          ) : (
            <div>
              <Allocations></Allocations>
            </div>
          )}
        </Row>
      </Container>
    </>
  );
};

export default ProjectSettings;
