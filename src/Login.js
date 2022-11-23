import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const Submit = () => {
    Navigate("/Project");
  };

  return (
    <>
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
              <button
                type="submit"
                onClick={Submit}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="branding">
        <h1 className="brandName">GadgEon</h1>
        <h3>Sprint planner</h3>
      </div>
    </>
  );
};

export default Login;
