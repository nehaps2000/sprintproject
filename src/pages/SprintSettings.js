import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Edit from "../custom-icons/Edit";
import Delete from "../custom-icons/Delete";
import Add from "../custom-icons/Add";
import { Card, Text } from "@nextui-org/react";
import api from "../utility/api";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Container, Row, Col } from "react-bootstrap";
import Spinner from "../components/Spinner";
import Planning from "../custom-icons/Planning";
import Unplanned from "../custom-icons/Unplanned";
import Unavailable from "../custom-icons/Unavailable";

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
  const [isLoading, setIsLoading] = useState(true);
  const Navigate = useNavigate();
  const current = new Date();
  const date = current.toISOString();

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let response2 = await api("get", url2);

      setSprintList(response);
      setHolidayList(response2);
      setIsLoading(false);
    };
    apiCall();
  }, []);

  useEffect(() => {
    if (sprintModal?.startDate && sprintModal?.endDate) {
      findDuration(sprintModal.startDate, sprintModal.endDate);
    }
  }, [sprintModal?.startDate, sprintModal?.endDate]);
  let role = localStorage.getItem("role");
  let pName = localStorage.getItem("pName");

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
    let d1 = currentSprint.startDate.toString().split("T")[0];
    let d2 = currentSprint.endDate.toString().split("T")[0];
    setSprintModal({ ...currentSprint, startDate: d1, endDate: d2 });
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
    let d1 = Date.parse(sDate);
    let d2 = Date.parse(eDate);

    let difference = (d2 - d1) / (1000 * 3600 * 24) + 1;
    holidayList?.forEach((holiday) => {
      let holidayDate = new Date(holiday.date.split("-").reverse().join("-"));
      holidayDate = Date.parse(holidayDate);
      if (d1 <= holidayDate && d2 >= holidayDate) {
        difference--;
      }
    });
    var start = new Date(sDate);
    const end = new Date(eDate);

    while (start <= end) {
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
      let newDate = start.setDate(start.getDate() + 1);
      start = new Date(newDate);
    }

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
    };
    apiCall();
  };

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
                        <Card css={{ mw: "430px" }}>
                          <Row>
                            <Card.Header>
                              <Col className="sprint-name">
                                <Text b>{sprint.name}</Text>
                              </Col>
                              <Col className="status">
                              {sprint.planningSprint === true ? (
                                <Planning></Planning>
                              ) : sprint.startDate <= date ? (
                                <Unavailable />
                              ) : (
                                <Unplanned></Unplanned>
                              )}
                              </Col>
                            </Card.Header>
                          </Row>
                          <Card.Divider />
                          <Card.Body css={{ py: "$10" }}>
                            <Text>
                              Sprint ID: {sprint.id}
                              <br></br>
                              Duration: {sprint.duration}
                              <br></br>
                            </Text>
                          </Card.Body>
                          <Card.Divider />
                          <Card.Footer>
                            <Row justify="flex-end">
                              {role === "0" || role === "4" ? (
                              <div style={{display: "flex"}}> <Col>
                               <Edit
                                    className="custom-icon"
                                    onClick={() => editSprint(sprint)}
                                  />
                                  <Delete
                                    className="custom-icon"
                                    onClick={() => deleteSprint(sprint)}
                                  />
                              </Col> 
                               <div className="Vadd">
                                
                               {sprint.planningSprint === true ? (
                                    <div className="card-button">
                                      <Button
                                        variant="secondary"
                                        onClick={() => navAddStory(sprint.id)}
                                      >
                                        AddStory
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        onClick={() => navViewStory(sprint.id)}
                                      >
                                        ViewStory
                                      </Button>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                
                                </div>  

                                  {sprint.startDate >= date &&
                                  sprint.planningSprint === false ? (
                                    <div className="card-button">
                                      <Button
                                        variant="secondary"
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
                                        Set as Planning Sprint
                                      </Button>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              ) : (
                                <></>
                              )}
                            </Row>
                          </Card.Footer>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </Row>
          </div>
        )}
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
                  name="name"
                  value={sprintModal.name}
                  onChange={handleChange}
                ></input>
                <Form.Label>Start date</Form.Label>
                <input
                  name="startDate"
                  value={sprintModal.startDate}
                  type="date"
                  onChange={handleChange}
                ></input>
                <Form.Label>End date</Form.Label>
                <input
                  name="endDate"
                  value={sprintModal.endDate}
                  type="date"
                  min={sprintModal.startDate}
                  onChange={handleChange}
                ></input>
                <Form.Label>Project</Form.Label>
                <input name="projectId" value={pName} disabled></input>
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
