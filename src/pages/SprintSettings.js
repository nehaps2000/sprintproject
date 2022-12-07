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
import { Link, useNavigate } from "react-router-dom";
import api from "../utility/api";
import Logout from "./Logout";

const SprintSettings = () =>{
    const url = "/api/Sprint/Sprints";
    const [sprintList , setSprintList] = useState([]);
    const [sprintModal, setSprintModal] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [addSprintModal, setAddSprintModal] = useState(false);
    const [deleteSprintModal, setDeleteSprintModal] = useState(false);
    const Navigate = useNavigate();

    useEffect(() => {
        const apiCall = async () => {
          let response = await api("get", url);
          setSprintList(response);
        };
        apiCall();
      }, [url]);

      const addOrEdit = (sprintModal) => {
        const addurl = `/api/Sprint/addSprint`;
    
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
      
      const sprintOpen = (id) => {
        Navigate(`/${id}/SprintSettings`);
      };

      const logout = (e) => {
        e.preventDefault();
        console.log("Logout");
    
        localStorage.clear();
        Navigate("/");
      };

      return(
        <>
        <div>
            <Link
              to="/"
              onClick={() => {
                logout();
              }}
            >
              <Logout className="logout"></Logout>
            </Link>
          </div>
        <div>
              <div>
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
                              onClick={() => sprintOpen(sprint.id)}
                            >
                              Sprint ID: {sprint.id}
                              <br></br>
                              Duration: {sprint.duration}
                              <br></br>
                            </Card.Text>
                            <Edit onClick={() => editview(sprint)} />
                            <Delete onClick={() => deleteSprint(sprint)} />
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
                      name="name"
                      value={sprintModal.name || ""}
                      onChange={handleChange}
                    ></input>
                    <Form.Label>Duration</Form.Label>
                    <input
                      name="duration"
                      value={sprintModal.duration || ""}
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