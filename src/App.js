import React from 'react';
import './App.css';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route}from 'react-router-dom';
import Project from './pages/Project';
import Team from './pages/Team';
import Allocations from './pages/Allocations';
import Resourses from './pages/Resourses';


function App() {
return (
	<Router>
	<Navbar />
	<Routes>
	
		<Route path='/project' element={<Project/>} />
		<Route path='/team' element={<Team/>} />
		<Route path='/Allocations' element={<Allocations/>} />
		<Route path='/Resourses' element={<Resourses/>} />

	</Routes>
	</Router>
);
}

export default App;


