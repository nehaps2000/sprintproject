import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./pages/Logout";

const Navbar = () => {
  const Navigate = useNavigate();
  const logout = (e) => {
    console.log("Logout");
    const confirm=alert('are you sure you want to logout?')
    localStorage.clear();
    Navigate("/");
  };

  return (
    <>
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
    </>
  );
};

export default Navbar;
