import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Add from "../custom-icons/Add";
import api from "../utility/api";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Spinner from "../components/Spinner";
import { Card,Grid,Text } from "@nextui-org/react";

const ProjectManager = () => {
  const url = `/api/Resource/GetScrumMasters`;
  const [managerList, setManagerList] = useState([]);
  const [show, setShow] = useState(false);
  const [managerModal, setManagerModal] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setManagerList(response);
      setIsLoading(false);
    };
    apiCall();
  }, [url]);

  const addOrEdit = (managerModal) => {
    const addurl = `/api/Resource/AddScrumMaster`;
    const apiCall = async () => {
      let response = await api("post", addurl, managerModal);
      if (response) {
        let response1 = await api("get", url);
        setManagerList(response1);
      }
    };
    apiCall();

    setManagerModal({});
    setShow(false);
  };

  const showHideModal = (status) => {
    setShow(status);
    if (!status) setManagerModal({});
  };

  const handleChange = ({ target: { name, value } }) => {
    setManagerModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <>
      <Container>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <Row>
              <Col>
                <div className="add">
                  <Add
                    onClick={() => {
                      showHideModal(true);
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <table className="table table-light">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Email</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {managerList.length > 0 ? (
                    managerList?.map((manager,i) => {
                      return (
                        <tr key={i}>
                          <td>{manager.employeeId}</td>
                          <td>{manager.email}</td>
                          <td>{manager.name}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <td>No records found</td>
                  )}
                  {}
                </tbody>
              </table>
            </Row>
          </div>
        )}
      </Container>

      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Employee ID</Form.Label>
              <input
                name="employeeId"
                value={managerModal.employeeId || ""}
                onChange={handleChange}
              ></input>
              <br></br>
              <Form.Label>Email</Form.Label>
              <input
                name="email"
                value={managerModal.email || ""}
                onChange={handleChange}
              ></input>
              <br></br>
              <Form.Label>Name</Form.Label>
              <input
                name="name"
                value={managerModal.name || ""}
                onChange={handleChange}
              ></input>
              <br></br>
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
              addOrEdit(managerModal);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ProjectManager;
