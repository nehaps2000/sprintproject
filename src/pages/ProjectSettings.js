import {useState} from 'react'

import Hamburger from 'hamburger-react';
import { Link } from "react-router-dom";
const ProjectSettings = () => {
    
    const [isOpen, setOpen] = useState(false)
    return (<>
        <Hamburger toggled={isOpen} toggle={setOpen} />
        <div class="card text-center">
  <div class="card-header">
    <ul class="nav nav-tabs card-header-tabs">
      <li class="nav-item">
        <Link to="/Allocations" class="nav-link active" >Allocations</Link>
      </li>
      <li class="nav-item">
        <Link to="/Resources" class="nav-link active" >Resources</Link>
      </li>
      <li class="nav-item">
        <Link to ="/Team"class="nav-link active" >Team</Link>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <h5 class="card-title">..........................</h5>
    <p class="card-text">.............................</p>
  </div>
</div>
    </>  )
  };


export default ProjectSettings