import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logout from "../custom-icons/Logout";

const Navbar = () => {
  const params = useParams();
  console.log(params);
  const url = "/api/Project/Projects";

  const [projectName, setProjectName] = useState("");
  const Navigate = useNavigate();

  useEffect(() => {
    setProjectName(localStorage.getItem(params.Id));
  });

  const logout = (e) => {
    console.log("Logout");
    const confirm = alert("are you sure you want to logout?");
    localStorage.clear();
    Navigate("/");
  };
  return (
    <>
      <div className="header">
        <div className="name"><h1>{projectName}</h1></div>
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
    </>
  );
};

export default Navbar;