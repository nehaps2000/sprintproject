import React from "react";
import "./App.css";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Project from "./pages/Project";
import Team from "./pages/Team";
import Allocations from "./pages/Allocations";
import Resources from "./pages/Resources";
import Login from "./Login";
function App() {
  return (<>
    <Router>
   
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Navbar />} /> 
        <Route path="/project" element={<Project />} />
        <Route path="/team" element={<Team />} />
        <Route path="/Allocations" element={<Allocations />} />
        <Route path="/Resources" element={<Resources />} />
        
      </Routes>
    </Router>
   </>
  );
}

export default App;






