import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logout from "../custom-icons/Logout";
import Hamburger from "./Hamburger";
import { Row } from "react-bootstrap";

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
    alert("are you sure you want to logout?");
    localStorage.clear();
    Navigate("/");
  };
  return (
    <Row>
      {params.Id ? (
        <div className="header">
          <div>
            <div>
              <Hamburger></Hamburger>
            </div>
          </div>
          <div>
            <div className="name">
              <h1>{projectName}</h1>
            </div>
          </div>

          <div className="gap10 flex">
            <span className="username">
              <h4>{username}</h4>
            </span>
            <span className="logout">
              <Logout
                onClick={() => {
                  logout();
                }}
              />
            </span>
          </div>
        </div>
      ) : (
        <div className="header">
          <div>
            <div className="username">
              <h4>Welcome {username} !</h4>
            </div>
          </div>
          <div>
            <div className="logout">
              <Logout
                onClick={() => {
                  logout();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Row>
  );
};

export default Navbar;
