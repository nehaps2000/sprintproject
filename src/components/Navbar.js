import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logout from "../custom-icons/Logout";
import Hamburger from "./Hamburger";

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
    setUserName(localStorage.getItem("name"));
  }, [username]);
  const logout = (e) => {
    console.log("Logout");
    const confirm = alert("are you sure you want to logout?");
    localStorage.clear();
    Navigate("/");
  };
  return (
    <>
      {params.Id ? (
        <div className="header">
          <div>
            <Hamburger></Hamburger>
          </div>
          <div className="name">
            <h1>{projectName}</h1>
          </div>
          <div className="username">Welcome {username}</div>
          <div className="logout">
            <Logout
              onClick={() => {
                logout();
              }}
            />
          </div>
        </div>
      ) : (
        <div className="header">
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
    </>
  );
};

export default Navbar;
