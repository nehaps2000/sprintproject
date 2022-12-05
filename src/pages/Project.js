import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Edit from "./Edit";
import Delete from "./Delete";
import Add from "./Add";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import api from "../utility/api";
import Calendar from "react-calendar";

const Project = () => {
  const url = "/api/Project/Projects";
  const url2 = "/api/Calendar/GetHoliday";
  const [projectList, setProjectList] = useState([]);
  const [projectModal, setProjectModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(false);
  const Navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(null);
  const [holidayList, setHolidayList] = useState([]);
  const [holidayModal, setHolidayModal] = useState({});

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let response2 = await api("get", url2);
      setProjectList(response);
      setHolidayList(response2);
    };
    apiCall();
  }, [url]);
  const token=localStorage.getItem("token");
  const addOrEdit = (projectModal) => {
    console.log("projectModal" + projectModal);
    const addurl = `/api/Project/addProject`;

    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl, projectModal);
        if (response) {
          let res = await api("get", url);
          setProjectList(res);
        }
      };
      apiCall();
    } else {
      const updateurl = `/api/Project/UpdateProject/${projectModal.id}`;
      const apiCall = async () => {
        let response = await api("patch", updateurl, projectModal);
        response = await api("get", url);
        setProjectList(response);
      };
      apiCall();
    }

    setShow(false);
    setProjectModal({});
  };

  const deleteOneProject = (projectModal) => {
    const deleteurl = `/api/project/DeleteProject/${projectModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", deleteurl);
      if (response) {
        let res = await api("get", url);
        setProjectList(res);
      }
    };
    apiCall();
    setAlert(false);
    setProjectModal({});
  };

  const showHideModal = (status) => {
    setShow(status);
    if (!status) setProjectModal({});
    setIsEdit(false);
  };

  const showConfirmModel = (status) => {
    setAlert(status);
  };

  const editview = (currentProject) => {
    setProjectModal({ ...currentProject });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteProject = (currentProject) => {
    setProjectModal({ ...currentProject });
    showConfirmModel(true);
  };

  const handleChange = ({ target: { name, value } }) => {
    setProjectModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleHolidayChange = ({ target: { name, value } }) => {
    setHolidayModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const projectOpen = (id) => {
    Navigate(`/projectSettings/${id}`);
  };

  const showHolidayModal = (status) => {
    setShow(status);
    if (!status) setHolidayModal({});
  };

  const addHoliday = (holidayModal) => {
    const addurl = `/api/Calendar/AddHoliday`;
    const apiCall = async () => {
      let response = await api("post", addurl, holidayModal);
      if (response) {
        let res = await api("get", url);
        setHolidayList(res);
      }
    };
    apiCall();
  };
console.log(holidayModal)
  return (
    <>
      <div class="card text-center">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li
              class="nav-item"
              onClick={() => {
                setSelectedTab("Project");
              }}
            >
              Projects
            </li>
            <li
              class="nav-item"
              onClick={() => {
                setSelectedTab("Calendar");
              }}
            >
              Holiday Calendar
            </li>
          </ul>
        </div>
        <div class="card-body">
          {selectedTab === "Calendar" ? (
            <div>
              <Calendar
                onClickDay={() => {
                  showHolidayModal(true);
                }}
              ></Calendar>
              {holidayList?.map((holiday) => {
                return (
                  <div class="accordion" id="accordionPanelsStayOpenExample">
                    <div class="accordion-item">
                      <h2
                        class="accordion-header"
                        id="panelsStayOpen-headingOne"
                      >
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseOne"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          hjmfhmh
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseOne"
                        class="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingOne"
                      >
                        <div class="accordion-body">
                          <strong>
                            This is the first item's accordion body.
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <div>
                <Row xs={1} md={5} className="g-4">
                  {projectList?.map((project) => {
                    return (
                      <Col key={project.id}>
                        <Card style={{ width: "auto" }}>
                          <Card.Body>
                            <Card.Title>{project.name}</Card.Title>
                            <Card.Text
                              style={{
                                width: "max content",
                                height: "max content",
                                border: "solid 1px black",
                              }}
                              onClick={() => projectOpen(project.id)}
                            >
                              Project ID: {project.id}
                              <br></br>
                              <br></br>
                            </Card.Text>
                            <Edit onClick={() => editview(project)} />
                            <Delete onClick={() => deleteProject(project)} />
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
          )}
        </div>
      </div>

      <div>
        <Modal show={show} onHide={() => showHideModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{isEdit ? "Edit" : "Add new"} Project</Modal.Title>
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
                  value={projectModal.name || ""}
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
                addOrEdit(projectModal);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={alert} onHide={() => showConfirmModel(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Project?</Modal.Title>
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
              onClick={() => deleteOneProject(projectModal)}
            >
              yes
            </Button>
            <Button
              className="secondary"
              onClick={() => showConfirmModel(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show} onHide={() => showHolidayModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add new holiday</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Date</Form.Label>
                <input name="holidayDate" value={Date}></input>
                <Form.Label>Name</Form.Label>
                <input
                  name="holidayName"
                  value={holidayModal?.holidayName}
                  onChange={handleHolidayChange}
                ></input>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => showHolidayModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                addHoliday(holidayModal);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Project;
