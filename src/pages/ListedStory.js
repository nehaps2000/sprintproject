import React from "react";
import api from "../utility/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Row, Col, Button } from "react-bootstrap";
import Spinner from "../components/Spinner";
import { Card, Text, Input, Grid } from "@nextui-org/react";

const ListedStory = () => {
  const params = useParams();
  let projectId = localStorage.getItem("id");
  let duration = localStorage.getItem("sprintDuration");
  let startDate = localStorage.getItem("sprintStart");
  let endDate = localStorage.getItem("sprintEnd");
  const url = `/api/Story/GetAddedStories/${params.Id}`;
  const allnurl = `/api/Allocation/SearchAllocation/${projectId}`;
  const pointsUrl = `/api/Point/SearchPoint/${params.Id}`;
  const Leaveurl = `/api/Leave/GetLeaves`;
  const [viewList, setViewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allocatedEmployees, setAllocatedEmployees] = useState([]);
  const [pointModal, setPointModal] = useState({});
  const [pointList, setPointList] = useState([]);

  const [leaveList, setLeaveList] = useState([]);
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let allocationres = await api("get", allnurl);
      let leaveres = await api("get", Leaveurl);
      let pointRes = await api("get", pointsUrl);
      setViewList(response);
      setAllocatedEmployees(allocationres);
      setLeaveList(leaveres);
      setPointList(pointRes);
      setIsLoading(false);
    };
    apiCall();
  }, []);
  let role = localStorage.getItem("role");

  const handleChange = ({ target: { name, value } }) => {
    if (name === "points") {
      setPointModal((prev) => {
        return { ...prev, [name]: parseInt(value) };
      });
    }
  };

  const addPoints = (pointModal) => {
    const addUrl = `/api/Point/AddPoint`;
    const apiCall = async () => {
      let response = await api("post", addUrl, pointModal);
      if (response) {
        let res = await api("get", addUrl);
        setPointList(res);
      }
    };
    apiCall();
  };
  console.log(viewList);
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
                {viewList?.map((story, i) => {
                  return (
                    <Grid.Container gap={2}>
                      <Card css={{ width: "100%" }}>
                        <Card.Body css={{ width: "100%" }} key={i}>
                          <Grid.Container>
                            <Grid css={{ width: "70px" }}>
                              <Text>{story.id}</Text>
                              <Text b>{story.name}</Text>
                            </Grid>
                            <Grid>
                              <Input
                                size="xs"
                                underlined
                                css={{ marginLeft: "300px", width: "100px" }}
                                labelPlaceholder="hours"
                                type="number"
                                min="0"
                                max="8"
                                name="points"
                                onChange={(e)=>{
                                  handleChange(e,story.id)
                                }}
                              ></Input>
                            </Grid>
                          </Grid.Container>
                        </Card.Body>
                      </Card>
                    </Grid.Container>
                  );
                })}
                {viewList.length > 0 ? (
                  <>
                    <br></br>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        addPoints(pointModal);
                      }}
                    >
                      Save all
                    </Button>
                  </>
                ) : (
                  <Card>
                    <Card.Body>
                      <Text>No records found</Text>
                    </Card.Body>
                  </Card>
                )}
              </Col>
              <Col>
                {role === "4" || role === "0" ? (
                  <>
                    {[
                      ...new Set(
                        allocatedEmployees.map(({ teamName }) => teamName)
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
                  <>
                    {[
                      ...new Set(
                        allocatedEmployees
                          .filter(
                            ({ name }) =>
                              name === localStorage.getItem("username")
                          )
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
