import React from "react";
import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="Navigation">
      <div className="btn-div">
        <button className="btn">
          <Link style={{textDecoration:'none',color:'#000080'}} to = "/project">Project</Link>
        </button>
        <button type="button" className="btn">
          <Link style={{textDecoration:'none',color:'#000080'}} to="/team">Team</Link>
        </button>
        <button type="button" className="btn">
          <Link style={{textDecoration:'none',color:'#000080'}} to="/allocations">Allocations</Link>
        </button>
        <button type="button" className="btn">
          <Link style={{textDecoration:'none',color:'#000080'}} to="/resourses">Resourses</Link>
        </button>
      </div>
    </nav>



  );
}

export default Navbar;