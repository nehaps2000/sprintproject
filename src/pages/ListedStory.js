import React from "react";

import api from "../utility/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hamburger from "../components/Hamburger";
const ListedStory = () => {
  const params = useParams();

 // let id = localStorage.getItem("sprintId");

  const url = `/api/Story/GetAddedStories/${params.Id}`;
  const [viewList, setViewList] = useState([]);

  console.log(params.Id, "params");
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setViewList(response);
    };
    apiCall();
  }, [url]);

  return (
    <><Navbar></Navbar>
    <Hamburger></Hamburger>
    <div className="selected"><h1>Selected Stories</h1></div>
        <table className="display">
   
      <tr>
        <th>Name</th>
        <th>ID</th>
      </tr>
      {viewList?.map((story) => {
            return (
              <tr key={story.name}>
                <td> {story.name}</td>
                <td> {story.id}</td>
        
              </tr>
            );
          })}
    </table>
  
</>  );
};
export default ListedStory;
