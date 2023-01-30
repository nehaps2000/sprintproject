import React from "react";
import api from "../utility/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Row } from "react-bootstrap";
import Spinner from "../components/Spinner";

const ListedStory = () => {
  const params = useParams();
  const url = `/api/Story/GetAddedStories/${params.Id}`;
  const [viewList, setViewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setViewList(response);
      setIsLoading(false);
    };
    apiCall();
  }, [url]);

  return (
    <>
      <div className="card-header">
        <Navbar></Navbar>
      </div>
      <Container>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <Row>
              <h1 className="selected">Selected Stories</h1>
            </Row>

            <Row>
              <table className="table table-light">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {viewList.length > 0 ? (
                    viewList?.map((story) => {
                      return (
                        <tr key={story.name}>
                          <td> {story.name}</td>
                          <td> {story.id}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <td colSpan={2}>No records found</td>
                  )}
                </tbody>
              </table>
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};
export default ListedStory;
