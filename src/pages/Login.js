import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";
import api from "../utility/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";
import { Container, Row, Col, Button } from "react-bootstrap";
import GadgEonLogo from "../custom-icons/GadgeonLogo";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleApi = async () => {
    let response = await api("post", "/api/Auth/Login", {
      username: email,
      password: password,
    });
    var decoded = jwtDecode(response);

    if (response !== "Wrong Credentials!") {
      localStorage.setItem("token", response);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.Name);
      localStorage.setItem("userId", decoded.EmpId);
      
      Navigate("/project");
    } else {
      toast.error("wrong credentials !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  return (
    <>
      <Container>
        <div className="wrapper-login">
          <Row>
            <Col>
              <form className="form">
                <div className="Form-content">
                  <h3 className="form-title">Login</h3>
                  <div className="form-group-mt-3">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      className="form-control mt-1"
                      placeholder="email"
                      onChange={handleEmail}
                    />
                  </div>
                  <div className="form-group-mt-3">
                    <label>Password</label>
                    <input
                      type="password"
                      value={password}
                      className="form-control mt-1"
                      placeholder="password"
                      onChange={handlePassword}
                    />
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <Button
                      type="button"
                      onClick={handleApi}
                      className="btn-btn-primary"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            </Col>
            <Col>
            <div>
                <div className="logoo">
                  <GadgEonLogo></GadgEonLogo>
                </div>
                <div className="branding">
               < h1>Sprint Manager</h1>
                </div>
                <ToastContainer />

            </div> 
             
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Login;
