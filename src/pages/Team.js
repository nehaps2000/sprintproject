import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Edit from "../custom-icons/Edit";
import Delete from "../custom-icons/Delete";
import Add from "../custom-icons/Add";
import api from "../utility/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Spinner from "../components/Spinner";
const Team = () => {
  const params = useParams();
  const url = `/api/Team/SearchTeam/${params.Id}`;
  const [teamList, setTeamList] = useState([]);
  const [teamModal, setTeamModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setTeamList(response);
      setIsLoading(false);
    };
    apiCall();
  }, [url]);
  let role = localStorage.getItem("role");
  let pName = localStorage.getItem("pName");
  const addOrEdit = (teamModal) => {
    const addurl = `/api/Team/AddTeam`;
    teamModal.projectId = params.Id;
    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl, teamModal);
        if (response) {
          let response1 = await api("get", url);
          setTeamList(response1);
        }
      };
      apiCall();
    } else {
      const updateurl = `/api/Team/UpdateTeam/${teamModal.id}`;
      const apiCall = async () => {
        let response = await api("patch", updateurl, teamModal);
        if (response) {
          let response1 = await api("get", url);
          setTeamList(response1);
        }
      };
      apiCall();
    }
    setTeamModal({});
    setShow(false);
  };

  const deleteOneTeam = (teamModal) => {
    const deleteurl = `/api/Team/DeleteTeam/${teamModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", deleteurl);
      if (response) {
        let res = await api("get", url);
        setTeamList(res);
      }
    };
    apiCall();
    setDel(false);
    setTeamModal({});
  };

  const showHideModal = (status) => {
    setShow(status);
    if (!status) setTeamModal({});
    setIsEdit(false);
  };

  const showDeleteModal = (status) => {
    setDel(status);
  };

  const editTeam = (currentTeam) => {
    setTeamModal({ ...currentTeam });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteTeam = (currentTeam) => {
    setTeamModal({ ...currentTeam });
    showDeleteModal(true);
  };

  const handleChange = ({ target: { name, value } }) => {
    setTeamModal((prev) => {
      return { ...prev, [name]: value };
    });
  };
  return (
    <Container>
      <div>
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
              <table className="table table-light">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    {role === "0" || role === "4" ? <th>Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {teamList.length > 0 ? (
                    teamList?.map((team) => {
                      return (
                        <tr key={team.name}>
                          <td> {team.name}</td>
                          <td> {team.projectId}</td>
                          {role === "0" || role === "4" ? (
                            <td>
                              <span>
                                <Edit
                                  className="custom-icon"
                                  onClick={() => {
                                    editTeam(team);
                                  }}
                                />
                              </span>
                              <span>
                                <Delete
                                  className="custom-icon"
                                  onClick={() => {
                                    deleteTeam(team);
                                  }}
                                />
                              </span>
                            </td>
                          ) : (
                            <></>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <td>No records found</td>
                  )}
                </tbody>
              </table>
            </Row>
          </div>
        )}
      </div>

      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add new"} Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <input
                name="name"
                value={teamModal.name || ""}
                onChange={handleChange}
              ></input>
              <Form.Label>Project Name</Form.Label>
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
              addOrEdit(teamModal);
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
          <Button
            className="btn btn-dark"
            variant="secondary"
            onClick={() => showDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-dark"
            variant="primary"
            onClick={() => {
              deleteOneTeam(teamModal);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Team;
