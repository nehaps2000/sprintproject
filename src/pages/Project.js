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
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import Navbar from "../Navbar";

const Project = () => {
  const url = "/api/Project/Projects";
  const url2 = "/api/Calendar/GetHoliday";
  const [projectList, setProjectList] = useState([]);
  const [projectModal, setProjectModal] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [deleteProjectModal, setDeleteProjectModal] = useState(false);
  const [addHolidayModal, setAddHolidayModal] = useState(false);
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

    setAddProjectModal(false);
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
    setDeleteProjectModal(false);
    setProjectModal({});
  };

  const showHideModal = (status) => {
    setAddProjectModal(status);
    if (!status) setProjectModal({});
    setIsEdit(false);
  };

  const showConfirmModal = (status) => {
    setDeleteProjectModal(status);
  };

  const editview = (currentProject) => {
    setProjectModal({ ...currentProject });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteProject = (currentProject) => {
    setProjectModal({ ...currentProject });
    showConfirmModal(true);
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
    Navigate(`/${id}/projectSettings`);
  };

  const showHolidayModal = (status) => {
    setAddHolidayModal(status);
    if (!status) setHolidayModal({});
  };

  const addHoliday = async (holidayModal) => {
    const addHolidayUrl = `/api/Calendar/AddHoliday`;
    let response = await api("post", addHolidayUrl, holidayModal);
    if (response) {
      let res2 = await api("get", url2);
      setHolidayList(res2);
    }
    setAddHolidayModal(false);
    setHolidayModal({});
  };

  const holidayGrouping = (holidayList) => {
    let d = {};
    console.log(holidayList);
    holidayList.forEach((holiday) => {
      var date = new Date(holiday.date);
      var year = date.getFullYear;
      if(d.keys && !d.keys.includes(year))
      {
      d.year = [];
      d.year.push(date);
      }
      else if(d.keys){
        d.year=[]
        d.year.push(date)
      }
      console.log(d)
      console.log(date,year);
    });
    
  };

  return (
    <>
      <div class="card-text-center">
        <div class="card-header">
          <Navbar></Navbar>
        </div>
        <div class="card-body">
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
              Holidays
            </li>
          </ul>
          {selectedTab === "Calendar" ? (
            <div className="accordion">
              <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton></AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    {/* {holidayList?.map((holiday) => {
                      var date = new Date(holiday.date);
                      {
                        date.getFullYear();
                      }
                      return (
                        <>
                          {holiday.name} - {holiday.date}
                          <br></br>
                        </>
                      );
                    })} */
                    holidayGrouping(holidayList)
                    }
                  </AccordionItemPanel>
                </AccordionItem>
              </Accordion>
              <Add
                onClick={() => {
                  showHolidayModal(true);
                }}
              ></Add>
            </div>
          ) : (
            <div>
              <div className="card">
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
        <Modal show={addProjectModal} onHide={() => showHideModal(false)}>
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

        <Modal show={deleteProjectModal} onHide={() => showConfirmModal(false)}>
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

        <Modal show={addHolidayModal} onHide={() => showHolidayModal(false)}>
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
                <input
                  name="date"
                  class="form-label"
                  for="formControlDisabled"
                  type="date"
                  onChange={handleHolidayChange}
                  value={holidayModal?.date}
                ></input>
                <Form.Label>Name</Form.Label>
                <input
                  name="name"
                  value={holidayModal?.name}
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
