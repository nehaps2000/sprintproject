import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Edit from "../custom-icons/Edit";
import Delete from "../custom-icons/Delete";
import Add from "../custom-icons/Add";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import api from "../utility/api";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hamburger from "../components/Hamburger";
import moment from "moment/moment";

const SprintSettings = () => {
  const params = useParams();
  const url = `/api/Sprint/SearchSprint/${params.Id}`;
  const url2 = `/api/Calendar/GetHoliday`;
  const [sprintList, setSprintList] = useState([]);
  const [sprintModal, setSprintModal] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [addSprintModal, setAddSprintModal] = useState(false);
  const [deleteSprintModal, setDeleteSprintModal] = useState(false);
  const [holidayList, setHolidayList] = useState([]);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let response2 = await api("get", url2);
      console.log(response2);
      setSprintList(response);
      setHolidayList(response2);
    };
    apiCall();
  }, [url,url2]);

  useEffect(() => {
    if (sprintModal?.StartDate && sprintModal?.EndDate) {
      findDuration(sprintModal.StartDate, sprintModal.EndDate);
    }
  }, [sprintModal?.StartDate, sprintModal?.EndDate]);
  console.log(sprintModal)
  const addOrEdit = (sprintModal) => {
    const addurl = `/api/Sprint/addSprint`;

    sprintModal.projectId = params.Id;
    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl, sprintModal);
        if (response) {
          let res = await api("get", url);
          setSprintList(res);
        }
      };
      apiCall();
    } else {
      const updateurl = `/api/Sprint/UpdateSprint/${sprintModal.id}`;
      const apiCall = async () => {
        let response = await api("patch", updateurl, sprintModal);
        response = await api("get", url);
        setSprintList(response);
      };
      apiCall();
    }

    setAddSprintModal(false);
    setSprintModal({});
  };

  const deleteOneSprint = (sprintModal) => {
    const deleteurl = `/api/sprint/DeleteSprint/${sprintModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", deleteurl);
      if (response) {
        let res = await api("get", url);
        setSprintList(res);
      }
    };
    apiCall();
    setDeleteSprintModal(false);
    setSprintModal({});
  };

  const showHideModal = (status) => {
    setAddSprintModal(status);
    if (!status) setSprintModal({});
    setIsEdit(false);
  };

  const showConfirmModal = (status) => {
    setDeleteSprintModal(status);
  };

  const editview = (currentSprint) => {
    setSprintModal({ ...currentSprint });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteSprint = (currentSprint) => {
    setSprintModal({ ...currentSprint });
    showConfirmModal(true);
  };

  const handleChange = ({ target: { name, value } }) => {
    setSprintModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const findDuration = (sDate, eDate) => {
    console.log(sDate, eDate);
    let d1 = Date.parse(sDate);
    let d2 = Date.parse(eDate);

    let difference = (d2 - d1) / (1000 * 3600 * 24) + 1;

    // console.log(Date(sDate).toString().split(" ")[0]);

    holidayList?.forEach((holiday) => {
      let holidayDate = new Date(holiday.date.split("-").reverse().join("-"));

      if (d1 <= holidayDate && d2 >= holidayDate) {
        difference--;
      }
    });
    var start = new Date(sDate);
    const end = new Date(eDate);

    while (start <= end) {
      console.log("day", start.getDay());
      let newDate = start.setDate(start.getDate() + 1);
      var dateB = Date.parse(start);
      if (start.getDay() === 0 || start.getDay() === 6) {
        difference--;
      }
      holidayList.forEach((holiday) => {
        var d = moment(holiday.date, "DD-MM-YYYY");
        let dd = Date.parse(d);
        if (d1 <= dd && d2 >= dd) {
          if (dateB === dd) {
            difference++;
          }
        }
      });

      start = new Date(newDate);
    }

    console.log(difference);
    setSprintModal((prev) => {
      return { ...prev, duration: difference };
    });
    return difference;
  };

  return (
    <>
      <div className="card-header">
        <Navbar></Navbar>
        <Hamburger></Hamburger>
      </div>
      <div>
        <div className="card-body">
          <Row xs={1} md={5} className="g-4">
            {sprintList?.map((sprint) => {
              return (
                <Col key={sprint.id}>
                  <Card style={{ width: "auto" }}>
                    <Card.Body>
                      <Card.Title>{sprint.name}</Card.Title>
                      <Card.Text
                        style={{
                          width: "max content",
                          height: "max content",
                          border: "solid 1px black",
                        }}
                      >
                        Sprint ID: {sprint.id}
                        <br></br>
                        Duration: {sprint.duration}
                        <br></br>
                      </Card.Text>
                      <Edit className="edit" onClick={() => editview(sprint)} />
                      <Delete
                        className="delete"
                        onClick={() => deleteSprint(sprint)}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <div className="add">
            <Add
              onClick={() => {
                showHideModal(true);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <Modal show={addSprintModal} onHide={() => showHideModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{isEdit ? "Edit" : "Add new"} Sprint</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Name</Form.Label>
                <input
                  name="Name"
                  value={sprintModal.Name || ""}
                  onChange={handleChange}
                ></input>
                <Form.Label>Start date</Form.Label>
                <input
                  name="StartDate"
                  value={sprintModal.StartDate}
                  type="date"
                  onChange={handleChange}
                ></input>
                <Form.Label>End date</Form.Label>
                <input
                  name="EndDate"
                  value={sprintModal.EndDate}
                  type="date"
                  min={sprintModal.StartDate}
                  onChange={handleChange}
                ></input>
                <Form.Label>ProjectID</Form.Label>
                <input
                  name="ProjectId"
                  value={sprintModal.projectId || params.Id}
                  disabled
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
                addOrEdit(sprintModal);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={deleteSprintModal} onHide={() => showConfirmModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Sprint?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <h1>Do you really want to delete?</h1>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="secondary"
              onClick={() => deleteOneSprint(sprintModal)}
            >
              Yes
            </Button>
            <Button
              className="secondary"
              onClick={() => showConfirmModal(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default SprintSettings;
