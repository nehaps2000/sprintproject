import { useState } from "react";
import Allocations from "./Allocations";
import Resources from "./Resources";
import Team from "./Team";
import { slide as Menu } from "react-burger-menu";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
const ProjectSettings = () => {
  const [selectedTab, setSelectedTab] = useState(null);

  const params = useParams();
  console.log(params.Id);

  return (
    <>
      <div class="card text-center">
        <div className="Hamburger">
          <Menu>
            <Link
              id="projectsettings"
              className="menu-item1"
              to="#"
            >
              Project Settings
            </Link>
            <Link to= 
           { `/${params.Id}/SprintSettings`}
              >
              Sprint Settings
            </Link>
          </Menu>
        </div>
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li
              class="nav-item"
              onClick={() => {
                setSelectedTab("Allocations");
              }}
            >
              Allocations
            </li>
            <li
              class="nav-item"
              onClick={() => {
                setSelectedTab("Resources");
              }}
            >
              Resources
            </li>
            <li
              class="nav-item"
              onClick={() => {
                setSelectedTab("Team");
              }}
            >
              Team
            </li>
          </ul>
        </div>
        <div class="card-body">
          {selectedTab === "Team" ? (
            <div>
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
