import React from "react";
import {useHistory} from "react-router-dom"
import { useState, useEffect } from "react";
import "./App.css";
const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const history = useHistory();
  // useEffect(() =>{
  //   if(localStorage.getItem('https://run.mocky.io/v3/36a41f98-356e-4182-aab1-775429653f4f')){
  //     history.push("/Welcome")
  //   }},[])
  
  const Submit = () => {};

  return (
    <div>
    <div className="container">
      <form className="form">
        <div className="Form-content">
          <h3 className="form-title">Login</h3>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" onClick={Submit} className="btn btn-primary">
              Submit
            </button>
          </div>
          {/* <p className="forgot-password text-right mt-2">
            Forgot <Link to ="#">password?</Link>
          </p> */}
        </div>
      </form>
    </div>
    <div className="branding">
      <h1 className="brandName">GadgEon</h1>
      <h3>Sprint planner</h3>
    </div>
    </div>
  );
};

export default App;

// import React,{useState} from 'react'

// const Login=()=>{
// 	const[email,setEmail]=useState("");
// 	const[passw,setPassw]=useState("");
// 	return(
// 		<div>
// 			<form action="">
// 				<div>
// 					<label htmlFor="email">Email</label>
// 					<input type="text" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
// 				</div>
// 				<div>
// 					<label htmlFor=”passw”>Password</label>
// 					<input type=”text” name=”passw” id=”passw” value={passw} onChange={(e)=>setPassw(e.target.value)}/>
// 				</div>
// 				<button type=”submit”>Login</button>
// 			</form>
// 		</div>
// 	)
// }

// export default Login
