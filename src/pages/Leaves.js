import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Calendar from "react-calendar";
import Navbar from "../components/Navbar";
import "react-calendar/dist/Calendar.css";
import Hamburger from "../components/Hamburger";
import api from "../utility/api";
import { useState, useEffect } from "react";
import format from "date-fns/format";
import Delete from "../custom-icons/Delete";
import Edit from "../custom-icons/Edit";
const Leaves = () => {
  const url = `/api/Leave/GetLeaves`;
  const [leaveList, setLeaveList] = useState([]);
  const [leaveModal, setLeaveModal] = useState({});
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLeave, setIsLeave] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());



 
  const [alert, setAlert] = useState(false);
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setLeaveList(response);
    };
    apiCall();
  }, [url]);
  console.log(leaveList, "here");

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
  const editview = (currentLeave) => {
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
    setLeaveModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (value) => {
    setSelectedDate(new Date(value));
    addLeave();
  };

  return (
    <div>
      <div className="card-header">
        <Navbar></Navbar>
        <Hamburger />
      </div>
      <div className="calendar">
        <Calendar
          onClickDay={handleDateChange}
          value={selectedDate}
          tileClassName={({ date }) => {
            {
              let isHighlighted = false;
              leaveList?.map((l) => {
                if (Date.parse(l.leaveDate) === Date.parse(date))
                  
                  isHighlighted = true;
              });
              if (isHighlighted) {
                setIsLeave(true);
                return "highlight"};
            }
          }}
          tileDisabled={({ date }) =>
            date.getDay() === 0 || date.getDay() === 6
          }
        ></Calendar>
      </div>
      <div>
        <table className="listed-leave">
          <tr>
            <th>EmployeeId</th>
            <th>Leave Date</th>
            <th>Hours</th>
            <th>Actions</th>
          </tr>
          {leaveList?.map((leave) => {
            return (
              <tr key={leave.employeeId}>
                <td> {leave.employeeId}</td>
                <td> {leave.leaveDate}</td>
                <td>{leave.hours}</td>
              
                <td>
                  {" "}
                  <span>
                  <Edit onClick={() => editview(leave)} />
                </span>
                  <span>
                    <Delete onClick={() => deleteLeave(leave)} />
                  </span>
                
                </td>
              </tr>
            );
          })}{" "}
        </table>
      </div>

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
                value={leaveModal.employeeId || ""}
                onChange={handleChange}
              ></input>
              <Form.Label>Leave Date</Form.Label>

              <input
                name="leaveDate"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={handleChange}
              ></input>
              <Form.Label>Hours</Form.Label>
              <input
                type="radio"
                name="hours"
                value="8"
                defaultChecked
                onChange={handleChange}
              />
              <span>Full day</span>

              <input
                type="radio"
                name="hours"
                value="4"
                onChange={handleChange}
              />
               <span>Half day</span>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => showHideModal(false)}>
            Cancel
          </Button>
          <Button
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
            className="secondary"
            onClick={() => deleteOneLeave(leaveModal)}
          >
            yes
          </Button>
          <Button className="secondary" onClick={() => showConfirmModel(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leaves;
