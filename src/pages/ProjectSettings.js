import { useState } from "react";
import Allocations from "./Allocations";
import Resources from "./Resources";
import Team from "./Team";
import Hamburger from "hamburger-react";
import { useParams } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

const ProjectSettings = () => {
  const [isOpen, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);

  const params = useParams();
  console.log(params);

  return (
    <>
      <div class="card text-center">
        <div className="hamburger">
          <Hamburger toggled={isOpen} toggle={setOpen}>
            <Menu pageWrapId={"page-wrap"}>
              <a id="home" className="menu-item" href="/">
                Home
              </a>
              <a id="about" className="menu-item" href="/about">
                About
              </a>
              <a id="contact" className="menu-item" href="/contact">
                Contact
              </a>
            </Menu>
          </Hamburger>
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
