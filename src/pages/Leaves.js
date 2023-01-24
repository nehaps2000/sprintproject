import React from "react";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Calendar from "react-calendar";
import Navbar from "../components/Navbar";
import "react-calendar/dist/Calendar.css";
import api from "../utility/api";
import { useState, useEffect } from "react";
import format from "date-fns/format";
import Delete from "../custom-icons/Delete";
import Edit from "../custom-icons/Edit";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
const Leaves = () => {
  const params = useParams();
  let empId = localStorage.getItem("userId");
  const url = `/api/Leave/GetLeave/${empId}`;
  const holidayUrl = `/api/Calendar/GetHoliday`;
  const Totalurl = `/api/Leave/GetLeaves`;
  const [leaveList, setLeaveList] = useState([]);
  const [holidayList, setHolidayList] = useState([]);
  const [leaveModal, setLeaveModal] = useState({ hours: 8 });
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sprintList, setSprintList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedSprint, setSelectedSprint] = useState("");
  const [sumList, setSumList] = useState();
  const [totalLeaves, setTotalLeaves] = useState({});
  const [nameList, setNameList] = useState([]);
  const [hoursList, setHoursList] = useState([]);
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setLeaveList(response);
      setIsLoading(false);
      let holRes = await api("get", holidayUrl);
      setHolidayList(holRes);
      // let leaveRes=await api("get",Totalurl)
      // setTotalLeaves(leaveRes);
    };
    apiCall();
  }, [url]);

  const apiCall1 = async () => {
    let leaveRes = await api("get", Totalurl);

    setTotalLeaves(leaveRes);

    console.log(leaveRes, "total Leave");
  };
  // console.log(totalLeaves,"total leaves")
  let role = localStorage.getItem("role");

  // console.log(holidayList);
  const addOrEdit = (leaveModal) => {
    const addurl = `/api/Leave/AddLeave`;
    console.log("hello my dear");
    leaveModal.employeeId = empId;
    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl, leaveModal);
        if (response) {
          let res = await api("get", url);
          console.log(res, "hello my dear1");
          setLeaveList(res);
        }
      };
      apiCall();
    } else {
      const updateurl = `/api/Leave/UpdateLeave/${leaveModal.id}`;
      const apiCall = async () => {
        let response = await api("patch", updateurl, leaveModal);
        response = await api("get", url);
        console.log(response, "hello my dear2");
        // let responseObj=[]
        // response.forEach( (data) =>{
        //   if(!data.employeeId in responseObj){
        //     responseObj.push(data)
        //   }
        //   else{
        //     response
        //   }
        // })

        // })
        setLeaveList(response);
      };
      apiCall();
    }

    setAddLeaveModal(false);
    setLeaveModal({});
  };
  const deleteOneLeave = (leaveModal) => {
    const deleteurl = `/api/Leave/DeleteLeave/${leaveModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", deleteurl);
      if (response) {
        let res = await api("get", url);
        setLeaveList(res);
      }
    };
    apiCall();
    setAlert(false);
    setLeaveModal({});
  };
  const handleButtonClick = () => {
    const sprinturl = `/api/Sprint/SearchSprint/${params.Id}`;
    const apiCall = async () => {
      const sprintres = await api("get", sprinturl);
      setSprintList(sprintres);
      // console.log(sprintList, "sprintList");
      // console.log(sprintres, "sprintres");
      //  console.log(sprintres.name,"lk")
    };
    apiCall();
    apiCall1();
    setIsModalVisible(true);
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const deleteLeave = (currentLeave) => {
    setLeaveModal({ ...currentLeave });
    showConfirmModel(true);
  };
  const showConfirmModel = (status) => {
    setAlert(status);
  };
  const sprintConfirmModel = (status) => {
    setIsModalVisible(status);
  };
  const editLeave = (currentLeave) => {
    setLeaveModal({ ...currentLeave });
    showHideModal(true);
    setIsEdit(true);
  };

  const showHideModal = (status) => {
    setAddLeaveModal(status);
    if (!status) setLeaveModal({});
    setIsEdit(false);
  };

  const addLeave = () => {
    showHideModal(true);
    setIsEdit(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    if (name === "hours") {
      setLeaveModal((prev) => {
        return { ...prev, [name]: parseInt(value) };
      });
    } else {
      setLeaveModal((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const handleDateChange = (value) => {
    value = format(value, "yyyy-MM-dd");
    setLeaveModal((prev) => {
      return { ...prev, leaveDate: value, hours: 8 };
    });
    addLeave();
  };
  // const handleSprintSelection=(e)=>{
  //   const selectedSprint =e.target.value;
  //    const sprintLeaves= totalLeaves.reduce((acc,leave))
  //    if(leave.sprint===selectedSprint){
  //     acc+=leave.hours;
  //    }
  //    return acc;
  // }
  const displayTotalLeaves = (e) => {
    setNameList(() => []);
    setHoursList(() => []);
    setSumList(() => []);
    const data = sprintList.find((sprint) => sprint.name === e.target.value)?.name;
    let getdata = data;
    const startDate = sprintList.find((sprint) => sprint.name === getdata)?.startDate.toString().split("T")[0];
    const endDate = sprintList.find((sprint) => sprint.name === getdata)?.endDate.toString().split("T")[0];
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    const sprintName = getdata;
    console.log("sprint name", sprintName);
    let sum = 0;
    // totalLeaves.map((item) => {
    //   const leaveDate = item.leaveDate.toString().split("T")[0];
    //   const flag = leaveDate > startDate && leaveDate < endDate;
    //   console.log(totalLeaves, "avc");
    //   if (flag === true) {
    //     console.log("name", item.name);
    //     console.log("hours", item.hours);
    //     console.log("empId", item.employeeId);
    //     // setNameList(item.name);
    //     const EmpName = [{ name: item.name, hours: item.hours }];
    //     EmpName.forEach((item) => {
    //       let EmpHours = (item.hours)/8;
    //       setNameList((prevNames) => [...prevNames, item.name]);

    //       setHoursList((prevHours) => [...prevHours, EmpHours]);
    //       // setNameList[]
    //     });
    //     console.log("EmpName", EmpName);
    //     // console.log("namek", nameList);
    //     // setHoursList(item.hours);

    //     if (item.hours === 4) sum = sum + 0.5;
    //     else if (item.hours === 8) sum = sum + 1;
    //     setSumList(sum);
    //   }
    // });
    // let employeeData = {};
    // totalLeaves.map((item) => {
    //   const leaveDate = item.leaveDate.toString().split("T")[0];
    //   const flag = leaveDate > startDate && leaveDate < endDate;
    //   console.log(totalLeaves, "avc");
    //   if (flag === true) {
    //     console.log("name", item.name);
    //     console.log("hours", item.hours);
    //     console.log("empId", item.employeeId);

    //     let EmpName = item.name;
    //     let EmpHours = item.hours / 8;
    //     let EmpId = item.employeeId;
    //      let index = nameList.indexOf((name) => name.emplyId === EmpId);

    //     console.log(nameList, "index");
    //     if (index === -1) {
    //       setNameList((prevNames) => [...prevNames, EmpName]);
    //       setHoursList((prevHours) => [...prevHours, EmpHours]);
    //     } else {
    //       setHoursList((prevHours) => {
    //         let newHoursList = [...prevHours];
    //         newHoursList[index] += EmpHours;
    //         return newHoursList;
    //       });
    //     }

    //     if (item.hours === 4) sum = sum + 0.5;
    //     else if (item.hours === 8) sum = sum + 1;
    //   }
    // });
    // setSumList(sum);

    // console.log("sum", sum);
    let employeeData = {};

    totalLeaves.map((item) => {
      const leaveDate = item.leaveDate.toString().split("T")[0];
      const flag = leaveDate > startDate && leaveDate < endDate;
      console.log(totalLeaves, "avc");
      if (flag === true) {
        console.log("name", item.name);
        console.log("hours", item.hours);
        console.log("empId", item.employeeId);

        const empId = item.employeeId;
        if (!employeeData[empId]) {
          employeeData[empId] = {
            name: item.name,
            hours: item.hours / 8,
            employeeId: item.employeeId,
          };
        } else {
          employeeData[empId].hours += item.hours / 8;
        }

        if (item.hours === 4) sum = sum + 0.5;
        else if (item.hours === 8) sum = sum + 1;
      }
    });

    setNameList(Object.values(employeeData).map((item) => item.name));
    setHoursList(Object.values(employeeData).map((item) => item.hours));
    setSumList(sum);
  };
  return (
    <div>
      <div className="card-header">
        <Navbar></Navbar>
      </div>
      <Container>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <div className="wrapper">
              <Row>
                <Col>
                  <Calendar
                    onClickDay={handleDateChange}
                    tileClassName={({ date }) => {
                      let isLeave = false;
                      leaveList?.forEach((l) => {
                        if (Date.parse(l.leaveDate) === Date.parse(date))
                          isLeave = true;
                      });
                      if (isLeave) {
                        return "highlight-leave";
                      }

                      let isHoliday = false;
                      holidayList?.forEach((h) => {
                        var cDate =
                          h.date.split("-").reverse().join("-") + " 00:00:00";
                        cDate = new Date(cDate);

                        if (Date.parse(cDate) === Date.parse(date)) {
                          // console.log("inside if");
                          isHoliday = true;
                        }
                      });
                      if (isHoliday) {
                        return "highlight-holiday";
                      }
                    }}
                    tileDisabled={({ date }) =>
                      date.getDay() === 0 || date.getDay() === 6
                    }
                  ></Calendar>

                  <Col>
                    <Row>
                      {role === "0" ? (
                        <Button onClick={handleButtonClick}>
                          Get all Sprint
                        </Button>
                      ) : (
                        <></>
                      )}
                    </Row>
                  </Col>
                </Col>
                <Col>
                  <table class="table table-light">
                    <thead>
                      <tr>
                        <th>EmployeeId</th>
                        <th>Leave Date</th>
                        <th>Hours</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveList?.map((leave) => {
                        return (
                          <tr key={leave.employeeId}>
                            <td> {leave.employeeId}</td>
                            <td> {leave.leaveDate.toString().split("T")[0]}</td>
                            <td>{leave.hours}</td>

                            <td>
                              <div>
                                <span>
                                  <Edit onClick={() => editLeave(leave)} />
                                </span>
                                <span>
                                  <Delete onClick={() => deleteLeave(leave)} />
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Container>

      <Modal show={addLeaveModal} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add new"} Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Employee ID</Form.Label>
              <input
                name="employeeId"
                value={empId}
                onChange={handleChange}
                disabled
              ></input>
              <Form.Label>Leave Date</Form.Label>
              <input
                name="leaveDate"
                value={leaveModal.leaveDate}
                onChange={handleChange}
              ></input>
              <Form.Label>Hours</Form.Label>
              <input
                type="radio"
                name="hours"
                defaultChecked
                value={8}
                checked={leaveModal.hours === 8}
                onChange={handleChange}
              />
              <span>Full day</span>

              <input
                type="radio"
                name="hours"
                value={4}
                checked={leaveModal.hours === 4}
                onChange={handleChange}
              />
              <span>Half day</span>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-dark"
            variant="secondary"
            onClick={() => showHideModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-dark"
            variant="primary"
            onClick={() => {
              addOrEdit(leaveModal);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={alert} onHide={() => showConfirmModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Leave?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <h1>Do you really want to delete?</h1>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-dark"
            onClick={() => deleteOneLeave(leaveModal)}
          >
            Yes
          </Button>
          <Button
            className="btn btn-dark"
            onClick={() => showConfirmModel(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={isModalVisible} onHide={() => sprintConfirmModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Total Leaves</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <select onChange={e=>setSelectedSprint(e.target.value)}>
          
              {sprintList.map((sprint) => {
                return <option key={sprint.id} value={sprint.name}>{sprint.name}</option>;
              })}
            </select> */}
            <div>
              <select onChange={(e) => displayTotalLeaves(e)}>
                <option>select sprint</option>

                {sprintList.map((sprint) => (
                  <option key={sprint.id} value={sprint.name}>
                    {sprint.name}
                  </option>
                ))}
              </select>
              <table>
                <tr>
                  <th>Name</th>
                  <th>Hours</th>
                </tr>

                {nameList.map((name, index) => (
                  <tr key={index}>
                    <td>{name}</td>
                    <td>{hoursList[index]} day</td>
                  </tr>
                ))}

                {/* <td>{EmpHours}</td> */}
              </table>

              {sumList !== null ? (
                <p>Total leaves for selected sprint: {sumList}</p>
              ) : (
                <p>Select a sprint to see total leaves</p>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-dark"
            onClick={() => handleModalCancel(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leaves;
