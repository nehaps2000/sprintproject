import React from "react";
import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="Navigation">
      <div className="btn-div">
        <button className="btn">
          <Link to = "/project">Project</Link>
        </button>
        <button type="button" className="btn">
          <Link to="/team">Team</Link>
        </button>
        <button type="button" className="btn">
          <Link to="/allocations">Allocations</Link>
        </button>
        <button type="button" className="btn">
          <Link to="/resourses">Resourses</Link>
        </button>
      </div>
    </nav>



  );
}

export default Navbar;