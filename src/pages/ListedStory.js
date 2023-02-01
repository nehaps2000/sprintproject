import React from "react";
import api from "../utility/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Row, Col } from "react-bootstrap";
import Spinner from "../components/Spinner";

const ListedStory = () => {
  const params = useParams();
  let projectId = localStorage.getItem("id");
  let duration = localStorage.getItem("sprintDuration");
  let startDate = localStorage.getItem("sprintStart");
  let endDate = localStorage.getItem("sprintEnd");
  const url = `/api/Story/GetAddedStories/${params.Id}`;
  const allnurl = `/api/Allocation/SearchAllocation/${projectId}`;
  const Leaveurl = `/api/Leave/GetLeaves`;
  const [viewList, setViewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allocatedEmployees, setAllocatedEmployees] = useState([]);
  
  const [leaveList, setLeaveList] = useState([]);
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let allocationres = await api("get", allnurl);
      let leaveres = await api("get", Leaveurl);
      setViewList(response);
      setAllocatedEmployees(allocationres);
      setLeaveList(leaveres);
      setIsLoading(false);
    };
    apiCall();
  }, []);
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
              <Col>
                <h1 className="selected">Selected Stories</h1>
              </Col>
              <Col>
                <h1 className="selected">Hours Split</h1>
              </Col>
            </Row>

            <Row>
              <Col>
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
              </Col>
              <Col>
                {allocatedEmployees.length > 0 ? (
                  <>
                    {[
                      ...new Set(
                        allocatedEmployees .filter(({ name }) => name === localStorage.getItem("username"))
                        .map(({ teamName }) => teamName)
                      ),
                    ].map((teamName) => {
                      let totalHours = 0;
                      let employeeCount = 0;
                      return (
                        <>
                          <div key={teamName}>
                            <h3>{teamName}</h3>
                            <ul>
                              {[
                                ...new Set(
                                  allocatedEmployees
                                    .filter(
                                      ({ teamName: allocationTeamName }) =>
                                        allocationTeamName === teamName
                                    )
                                    .map(({ name }) => name)
                                ),
                              ].map((employee) => {
                                let leaveHours = 0;

                                leaveList.forEach((leave) => {
                                  if (employee === leave.name)
                                    if (
                                      leave.leaveDate >= startDate &&
                                      leave.leaveDate <= endDate
                                    )
                                      leaveHours = leave.hours;
                                });
                                totalHours = totalHours + leaveHours;
                                employeeCount++;
                              })}
                            </ul>
                            <p>
                              Total available hours:
                              {duration * employeeCount * 8 - totalHours}
                            </p>
                          </div>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <tr className="empty-table">No records found</tr>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </>
  );
};
export default ListedStory;
