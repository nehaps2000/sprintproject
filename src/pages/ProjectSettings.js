import { useState } from "react";
import Allocations from "./Allocations";
import Resources from "./Resources";
import Team from "./Team";
import Hamburger from "hamburger-react";
import { useParams } from "react-router-dom";

const ProjectSettings = () => {
  const [isOpen, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);

  const params = useParams();
  console.log(params);

  return (
    <>
      <Hamburger toggled={isOpen} toggle={setOpen} />

      <div class="card text-center">
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