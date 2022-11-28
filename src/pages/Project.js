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

const Project = () => {
  const url = "/api/Project/Projects";
  const [projectList, setProjectList] = useState([]);
  const [projectModal, setProjectModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setProjectList(response);
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
          let response1 = await api("get", url);
          setProjectList(response1);
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
    const deleteurl = `/api/project/DeleteProject/{projectModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", deleteurl);
      setProjectList(response);
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

  const projectOpen = (id) => {
    Navigate(`/projectSettings/${id}`);
  };

  return (
    <div>
      <Row xs={1} md={5} className="g-4">
        {projectList?.map((project) => {
          return (
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text
                    style={{
                      width: "max content",
                      height: "max content",
                      border: "solid 1px red",
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

      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add new"} Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <input
                name="name"
                value={projectModal.name || " "}
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
              console.log("calling");
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
          <Button className="secondary" onClick={() => showConfirmModel(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Project;
