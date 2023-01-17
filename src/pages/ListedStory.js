import React from "react";
import api from "../utility/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Row, Col } from "react-bootstrap";

const ListedStory = () => {
  const params = useParams();
  const url = `/api/Story/GetAddedStories/${params.Id}`;
  const [viewList, setViewList] = useState([]);
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setViewList(response);
    };
    apiCall();
  }, [url]);

  return (
    <>
      <div className="card-header">
        <Navbar></Navbar>
      </div>
      <Container>
        <Row>
          <h1 className="selected">Selected Stories</h1>
        </Row>
        <Row>
          <table class="table table-light">
            {" "}
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {viewList?.map((story) => {
                return (
                  <tr key={story.name}>
                    <td> {story.name}</td>
                    <td> {story.id}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Row>
      </Container>
    </>
  );
};
export default ListedStory;
