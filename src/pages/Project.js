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
import "react-accessible-accordion/dist/fancy-example.css";

const Project = () => {
  const url = "/api/Project/Projects";
  const [projectList, setProjectList] = useState([]);
  const [projectModal, setProjectModal] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [deleteProjectModal, setDeleteProjectModal] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setProjectList(response);
    };
    apiCall();
  }, [url]);
  let role = localStorage.getItem("role");
  
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

  const editProject = (currentProject) => {
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

  const projectOpen = (id, pName) => {
    localStorage.setItem("id", id);
    localStorage.setItem("pName", pName);
    Navigate(`/${id}/projectSettings`);
  };

  return (
    <>
      <div className="card-text-center">
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
                          onClick={() => projectOpen(project.id, project.name)}
                        >
                          Project ID: {project.id}
                          <br></br>
                          <br></br>
                        </Card.Text>
                        {role === "0" || role === "4" ? (
                          <div>
                            <Edit
                              className="edit"
                              onClick={() => editProject(project)}
                            />
                            <Delete
                              className="delete"
                              onClick={() => deleteProject(project)}
                            />
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
            {role === "4" || role === "0" ? (
              <Add
                className="add"
                onClick={() => {
                  showHideModal(true);
                }}
              />
            ) : (
              <div></div>
            )}
          </div>
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
      </div>
    </>
  );
};

export default Project;
