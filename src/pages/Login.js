import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";
import api from "../utility/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState("false");
  const Navigate = useNavigate();

  //  useEffect(()=>{
  //   if(!localStorage.getItem('token')){
  //     Navigate("/project");
  //   }
  //  })
  // const showToastMessage = () => {
  //   toast.error("Wrong Creditentials !", {
  //     position: toast.POSITION.TOP_RIGHT,
  //   });
  // };
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

    if (response !== "Wrong Credentials!") {
      localStorage.setItem("token", response);

      Navigate("/project");
    } else {
      toast.error("wrong credentials !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    // })
    // .catch((error) => {
    //   alert("service error");
    //   console.log(error);
    // });
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
                value={email}
                className="form-control mt-1"
                placeholder="email"
                onChange={handleEmail}
              />
            </div>
            <div className="form-group mt-3">
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
              <button
                type="button"
                onClick={handleApi}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="branding">
        <ToastContainer />

        <h1 className="brandName">GadgEon</h1>
        <h3>Sprint planner</h3>
      </div>
    </>
  );
};

export default Login;
//.split('.').length === 3
