import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Edit from "../custom-icons/Edit";
import Delete from "../custom-icons/Delete";
import Add from "../custom-icons/Add";
import Card from "react-bootstrap/Card";
import api from "../utility/api";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Container, Row, Col } from "react-bootstrap";

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
  const Navigate = useNavigate();
  const current = new Date();
  const date = current.toISOString();
  console.log(date);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let response2 = await api("get", url2);
      setSprintList(response);
      setHolidayList(response2);
    };
    apiCall();
  }, [url, url2]);

  useEffect(() => {
    if (sprintModal?.StartDate && sprintModal?.EndDate) {
      findDuration(sprintModal.StartDate, sprintModal.EndDate);
    }
  }, [sprintModal?.StartDate, sprintModal?.EndDate]);
  console.log(sprintModal);
  let role = localStorage.getItem("role");

  const addOrEdit = (sprintModal) => {
    const addurl = `/api/Sprint/AddSprint`;
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
    if (status === false) {
      setSprintModal({});
    }
    setIsEdit(false);
  };

  const showConfirmModal = (status) => {
    setDeleteSprintModal(status);
  };

  const editSprint = (currentSprint) => {
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

  const navAddStory = (id) => {
    Navigate(`/${params.Id}/Story/SearchStory/${id}`);
    localStorage.setItem("sprintId", id);
  };

  const navViewStory = (id) => {
    Navigate(`/${id}/ListedStory`);
  };

  const findDuration = (sDate, eDate) => {
    console.log(sDate, eDate);
    let d1 = Date.parse(sDate);
    let d2 = Date.parse(eDate);

    let difference = (d2 - d1) / (1000 * 3600 * 24) + 1;

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

  const handlePlan = (id) => {
    const planUrl = `/api/Sprint/PlanningSprint/${id}`;
    const apiCall = async () => {
      let response = await api("patch", planUrl, id);
      response = await api("get", url);
      setSprintList(response);
      console.log(sprintList);
    };
    apiCall();
  };

  return (
    <>
      <div className="card-header">
        <Navbar></Navbar>
      </div>
      <Container>
        <Row>
          {role === "4" || role === "0" ? (
            <Col>
              <div className="add">
                <Add
                  onClick={() => {
                    showHideModal(true);
                  }}
                />
              </div>
            </Col>
          ) : (
            <div></div>
          )}
        </Row>
        <Row>
          <div className="card-body">
            <Row xs={1} md={3} className="g-4">
              {sprintList?.map((sprint) => {
                return (
                  <Col key={sprint.id}>
                    <Card
                      style={{ width: "auto" }}
                      className={
                        sprint.planningSprint === true
                          ? "planned"
                          : sprint.startDate <= date
                          ? "unplanned"
                          : ""
                      }
                    >
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
                        {role === "0" || role === "4" ? (
                          <div>
                            <Edit
                              className="edit"
                              onClick={() => editSprint(sprint)}
                            />
                            <Delete
                              className="delete"
                              onClick={() => deleteSprint(sprint)}
                            />

                            {sprint.planningSprint === true ? (
                              <div className="card-button">
                                <Button
                                  className="btn btn-dark"
                                  onClick={() => navAddStory(sprint.id)}
                                >
                                  AddStory
                                </Button>
                                <Button
                                  className="btn btn-dark"
                                  onClick={() => navViewStory(sprint.id)}
                                >
                                  ViewStory
                                </Button>
                              </div>
                            ) : (
                              <></>
                            )}
                            {sprint.startDate >= date ? (
                              <div className="card-button">
                                <Button
                                  className="btn btn-dark"
                                  onClick={() => {
                                    confirmAlert({
                                      title: "Set as Planning Sprint",
                                      message: "Are you sure to do this?",
                                      buttons: [
                                        {
                                          label: "Yes",
                                          onClick: () => {
                                            handlePlan(sprint.id);
                                          },
                                        },
                                        {
                                          label: "No",
                                        },
                                      ],
                                    });
                                  }}
                                >
                                  PlanSprint
                                </Button>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Row>
      </Container>

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
              className="btn btn-dark"
              onClick={() => deleteOneSprint(sprintModal)}
            >
              Yes
            </Button>
            <Button
              className="btn btn-dark"
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
