import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Calendar from "react-calendar";
import Navbar from "../components/Navbar";
import "react-calendar/dist/Calendar.css";
import Hamburger from "../components/Hamburger";
import api from "../utility/api";
import { useState, useEffect} from "react";
import format from "date-fns/format";

const Leaves = () => {
  const url = `/api/Leave/GetLeaves`;
  const [leaveList, setLeaveList] = useState([]);
  const [leaveModal, setLeaveModal] = useState({});
  const [addLeaveModal, setAddLeaveModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  //const [isLeave, setIsLeave] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [del, setDel] = useState(false);
  
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setLeaveList(response);
    };
    apiCall();
  }, [url]);
  console.log(leaveList, "here");

  const addOrEdit = (leaveModal) => {
    console.log(leaveModal)
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
      const updateurl = `/api/Project/UpdateProject/${leaveModal.id}`;
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
    const deleteurl = `/api/Leave/DeleteLeave${leaveModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", deleteurl);
      if (response) {
        let res = await api("get", url);
        setLeaveList(res);
      }
    };
    apiCall();
    setDel(false);
    setLeaveModal({});
  };
  const showDeleteModal = (status) => {
    setDel(status);
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
                  // setIsLeave(true);
                  isHighlighted = true;
              });
              if (isHighlighted) return "highlight";
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
          </tr>
          {leaveList?.map((l) => {
            return (
              <tr key={l.employeeId}>
                <td> {l.employeeId}</td>

                <td> {l.leaveDate}</td>
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
      <Modal show={del} onHide={() => showDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Do you really want to delete ?</Form.Label>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => showDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              deleteOneLeave(leaveModal);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leaves;
