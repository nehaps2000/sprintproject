import { useState } from "react";
import Allocations from "./Allocations";
import Resources from "./Resources";
import Team from "./Team";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Hamburger from "../Hamburger";

const ProjectSettings = () => {
  const [selectedTab, setSelectedTab] = useState(null);
  const params = useParams();
  console.log(params.Id);

  return (
    <>
      <div className="card-text-center">
        <div className="card-header">
          <Navbar></Navbar>
          <Hamburger />
        </div>

        <div className="card-body">
          <div className="head">
            <ul className="nav nav-tabs card-header-tabs">
              <li
                className="nav-item"
                onClick={() => {
                  setSelectedTab("Allocations");
                }}
              >
                Allocations
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setSelectedTab("Resources");
                }}
              >
                Resources
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setSelectedTab("Team");
                }}
              >
                Team
              </li>
            </ul>
          </div>
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
        </div>
      </div>
    </>
  );
};

export default ProjectSettings;
