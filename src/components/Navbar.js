import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logout from "../custom-icons/Logout";
import Hamburger from "./Hamburger";
import { Col, Row } from "react-bootstrap";

const Navbar = () => {
  const params = useParams();
  console.log(params);
  const [username, setUserName] = useState("");
  const [projectName, setProjectName] = useState("");
  const Navigate = useNavigate();

  useEffect(() => {
    setProjectName(localStorage.getItem("pName"));
  }, [projectName]);

  useEffect(() => {
    setUserName(localStorage.getItem("username"));
  }, [username]);
  const logout = (e) => {
    console.log("Logout");
    const confirm = alert("are you sure you want to logout?");
    localStorage.clear();
    Navigate("/");
  };
  return (
    <Row>
      {params.Id ? (
        <div className="header">
          <Col>
            <div>
              <Hamburger></Hamburger>
            </div>
          </Col>
          <Col>
            <div className="name">
              <h1>{projectName}</h1>
            </div>
          </Col>
          <Col>
            <div className="username"><h4>{username}</h4></div>
          </Col>
          <Col>
            <div className="logout">
              <Logout
                onClick={() => {
                  logout();
                }}
              />
            </div>
          </Col>
        </div>
      ) : (
        <div className="header">
          <Col>
            <div className="username"><h4>Welcome {username} !</h4></div>
          </Col>
          <Col>
            <div className="logout">
              <Logout
                onClick={() => {
                  logout();
                }}
              />
            </div>
          </Col>
        </div>
      )}
    </Row>
  );
};

export default Navbar;
