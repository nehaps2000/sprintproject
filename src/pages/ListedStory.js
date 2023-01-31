import React from "react";
import api from "../utility/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Row } from "react-bootstrap";
import Spinner from "../components/Spinner";
import { duration } from "moment";

const ListedStory = () => {
  const params = useParams();
  let projectId = localStorage.getItem("id");
let duration=localStorage.getItem("sprintDuration")
let startDate=localStorage.getItem("sprintStart")
let endDate=localStorage.getItem("sprintEnd")
  const url = `/api/Story/GetAddedStories/${params.Id}`;
  const allnurl = `/api/Allocation/SearchAllocation/${projectId}`;
  const sprinturl = `/api/Sprint/SearchSprint/${projectId}`;
  const Leaveurl = `/api/Leave/GetLeaves`;
  const [viewList, setViewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allocatedEmployees, setAllocatedEmployees] = useState([]);
  const [sprintData, setSprintData] = useState([]);
  const [leaveList, setLeaveList] = useState([]);
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let allocationres = await api("get", allnurl);
      let sprintres = await api("get", sprinturl);
      let leaveres = await api("get", Leaveurl);
      setViewList(response);
      setAllocatedEmployees(allocationres);
      setSprintData(sprintres);
      setLeaveList(leaveres);
      console.log(leaveres, "leaveres");
      console.log(sprintres, "r1");
      console.log(allocationres, "allnres");
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

              {allocatedEmployees.length > 0 ? (
                <>
                  {[
                    ...new Set(
                      allocatedEmployees.map(({ teamName }) => teamName)
                    ),
                  ].map((teamName) => {
                    let totalHours=0;
                    let employeeCount=0;
                    return(
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
                            if(employee  === leave.name)
                            if(leave.leaveDate>=startDate&&leave.leaveDate<=endDate)
                              leaveHours = leave.hours;                  
                          })
                          console.log(leaveHours)
                          totalHours=totalHours+leaveHours
                          employeeCount++
                          return <li key={employee}>{employee} - {leaveHours}</li>;
                        })}
                      </ul>
                      <p>total hours:{duration*employeeCount*8 - totalHours}</p>
                      <p>total employeeCount:{employeeCount}</p>
                    </div>

                      </>
                    )
                  
})}
                </>
              ) : (
                <tr className="empty-table">No records found</tr>
              )}
            </Row>
          </div>
        )}
      </Container>
    </>
  );
  
};
export default ListedStory;
