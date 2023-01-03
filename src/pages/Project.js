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
import { useNavigate } from "react-router-dom";
import api from "../utility/api";
import ProjectManager from "./ProjectManager"
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import Navbar from "../components/Navbar";

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
  const [holidaySet, setHoliday] = useState({
    list: {},
    keys: [],
  });

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

  const projectOpen = (id,name) => {
    localStorage.setItem(id,name)
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
    console.log(holidayList)
    holidayList.forEach((holiday) => {
      var date = holiday.date;
      var year = date.split("-")[date.split("-").length - 1];
      const keys = Object.keys(d);
      if (keys.includes(year)) {
        d[`${year}`].push({
          name: holiday.name,
          date,
        });
      } else if (!keys.includes(year)) {
        d[`${year}`] = [];
        d[`${year}`].push({
          name: holiday.name,
          date,
        });
      }
    });
    setHoliday({
      list: d,
      keys: Object.keys(d),
    });
  };

  return (
    <>
      <div className="card-text-center">
        <div className="card-header">
          <Navbar></Navbar>
          <div className="head">
            <ul className="navbar nav nav-tabs card-header-tabs">
              <li
                className="nav-item"
                onClick={(e) => {
                  let elements = e.target.parentElement.children;
                  console.log(elements)
                  let i =0;
                  while(i<elements.length)
                  {
                    elements[i].style = "border:none";
                    i++;
                  }
                    e.target.style="border-bottom:solid red";
                  setSelectedTab("Project");
                }}
              >
                Projects
              </li>
              <li
                className="nav-item"
                onClick={(e) => {
                  let elements = e.target.parentElement.children;
                  let i =0;
                  while(i<elements.length)
                  {
                    elements[i].style = "border:none";
                    i++;
                  }
                  e.target.style="border-bottom:solid red";
                  holidayGrouping(holidayList);
                  setSelectedTab("Calendar");
                }}
              >
                Holidays
              </li>
              <li
                className="nav-item"
                onClick={(e) => {
                  let elements = e.target.parentElement.children;
                  let i =0;
                  while(i<elements.length)
                  {
                    elements[i].style = "border:none";
                    i++;
                  }
                  e.target.style="border-bottom:solid red";
                setSelectedTab("ProjectManager");
                }}
              >
                ProjectManagers
              </li>
            </ul>
          </div>
        </div>

        <div className="card-body">
          {selectedTab === "Calendar" ? (
            <div className="accordion">
              <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                {holidaySet.keys.map((key) => {
                  return (
                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>{key}</AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <ul>
                          {holidaySet.list[`${key}`].map((data) => {
                            console.log(holidaySet)
                            return (
                              <li className="accList" key={Math.random()}>
                                <b>{data.name}</b> <i>{data.date}</i>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionItemPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
              <Add
                onClick={() => {
                  showHolidayModal(true);
                }}
              ></Add>
            </div>
          ):selectedTab==="ProjectManager" ?(<ProjectManager></ProjectManager>): (
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
                              onClick={() => projectOpen(project.id,project.name)}
                            >
                              Project ID: {project.id}
                              <br></br>
                              <br></br>
                            </Card.Text>
                            <Edit
                              className="edit"
                              onClick={() => editview(project)}
                            />
                            <Delete
                              className="delete"
                              onClick={() => deleteProject(project)}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
                <Add
                  className="add"
                  onClick={() => {
                    showHideModal(true);
                  }}
                />
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
                  className="form-label"
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
