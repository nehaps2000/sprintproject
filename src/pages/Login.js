import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";
import api from "../utility/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";
import { Container, Row, Col, Button } from "react-bootstrap";

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
    console.log({ email, password });
    let response = await api("post", "/api/Auth/Login", {
      username: email,
      password: password,
    });
    var decoded = jwtDecode(response);
    console.log(decoded, "token decoded");
    console.log(decoded.role);

    if (response !== "Wrong Credentials!") {
      localStorage.setItem("token", response);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.Name);
      localStorage.setItem("userId", decoded.EmpId);
      console.log(decoded.Id, "love");
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
              <div className="branding">
                <ToastContainer />
                <img 
        // src={require('E:\sprintproject\src\pages\Gadgeon-logo.png')}
        src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fusercontent.one%2Fwp%2Fwww.gadgeon.eu%2Fwp-content%2Fuploads%2F2021%2F04%2Flogo.svg&imgrefurl=https%3A%2F%2Fwww.gadgeon.eu%2F&tbnid=za0BAQ2ZpE1keM&vet=12ahUKEwjW9ofGqNP8AhUsKbcAHX1yBBMQMygAegUIARCrAQ..i&docid=D14aGhRGkI6QjM&w=800&h=283&q=gadgeon%20logo&ved=2ahUKEwjW9ofGqNP8AhUsKbcAHX1yBBMQMygAegUIARCrAQ"
        // width={200}
        // height={200}
        className="image-style"
      />
                <h1>GadgEon</h1>
                <h3>Sprint planner</h3>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Login;
