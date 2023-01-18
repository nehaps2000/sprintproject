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

const Leaves = () => {
  const url = `/api/Leave/GetLeaves`;
  const [leaveList, setLeaveList] = useState([]);
  const [leaveModal, setLeaveModal] = useState({ hours: 8 });
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setLeaveList(response);
    };
    apiCall();
  }, [url]);
  let empId = localStorage.getItem("userId");
  const addOrEdit = (leaveModal) => {
    console.log(leaveModal);
    const addurl = `/api/Leave/AddLeave`;
    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl, leaveModal);
        if (response) {
          let res = await api("get", url);
          setLeaveList(res);
        }
      };
      apiCall();
    } else {
      const updateurl = `/api/Leave/UpdateLeave/${leaveModal.id}`;
      const apiCall = async () => {
        let response = await api("patch", updateurl, leaveModal);
        response = await api("get", url);
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

  const deleteLeave = (currentLeave) => {
    setLeaveModal({ ...currentLeave });
    showConfirmModel(true);
  };
  const showConfirmModel = (status) => {
    setAlert(status);
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

  return (
    <div>
      <div className="card-header">
        <Navbar></Navbar>
      </div>
      <Container>
        <div className="wrapper">
          <Row>
            <Col>
              <Calendar
                onClickDay={handleDateChange}
                tileClassName={({ date }) => {
                  {
                    let isHighlighted = false;
                    leaveList?.forEach((l) => {
                      if (Date.parse(l.leaveDate) === Date.parse(date))
                        isHighlighted = true;
                    });
                    if (isHighlighted) {
                      setIsLeave(true);
                      return "highlight";
                    }
                  }
                }}
                tileDisabled={({ date }) =>
                  date.getDay() === 0 || date.getDay() === 6
                }
              ></Calendar>
            </Col>
            <Col>
              <table class="table table-light">
                {" "}
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
    </div>
  );
};

export default Leaves;
