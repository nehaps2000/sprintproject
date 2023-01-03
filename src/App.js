import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Project from "./pages/Project";
import Login from "./pages/Login";
import ProjectSettings from "./pages/ProjectSettings";
import SprintSettings from "./pages/SprintSettings";
import StoryLog from "./pages/StoryLog";
import Leaves from "./pages/Leaves";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/project" element={<Project />} />
          <Route path="/:Id/ProjectSettings" element={<ProjectSettings />} />
          <Route path="/:Id/Sprint/SearchSprint" element={<SprintSettings />} />
          <Route path="/:Id/Story/SearchStory" element={<StoryLog />} />
          <Route path="/Leave/Getleave" element={<Leaves />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
