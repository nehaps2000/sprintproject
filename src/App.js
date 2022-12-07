import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Project from "./pages/Project";
import Team from "./pages/Team";
import Allocations from "./pages/Allocations";
import Resources from "./pages/Resources";
import Login from "./Login";
import ProjectSettings from "./pages/ProjectSettings";
import SprintSettings from "./pages/SprintSettings";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/project" element={<Project />} />
          <Route path="/team" element={<Team />} />
          <Route path="/Allocations" element={<Allocations />} />
          <Route path="/Resources" element={<Resources />} />
          <Route path="/:Id/ProjectSettings" element={<ProjectSettings />} />
          <Route path="/:Id/SprintSettings" element={<SprintSettings />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
