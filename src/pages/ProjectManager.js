import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Add from "../custom-icons/Add";
import api from "../utility/api";
import { useState, useEffect } from "react";

const ProjectManager = () => {
  const url = `/api/Resource/GetScrumMasters`;
  const [managerList, setManagerList] = useState([]);
  const [show, setShow] = useState(false);
  const [managerModal, setManagerModal] = useState({});

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setManagerList(response);
    };
    apiCall();
  }, [url]);

  const addOrEdit = (managerModal) => {
    const addurl = `/api/Resource/AddScrumMaster`;
    console.log(managerModal);
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
    <div>
      <Add
        className="add"
        onClick={() => {
          showHideModal(true);
        }}
      />

      <div className="main">
        <table className="team">
          <tr>
            <th>Employee ID</th>
            <th>Email</th>
            <th>Name</th>
          </tr>
          {managerList?.map((manager) => {
            return (
              <tr key={manager.projectId}>
                <td>{manager.employeeId}</td>
                <td>{manager.email}</td>
                <td>{manager.name}</td>
              </tr>
            );
          })}
        </table>

        <Modal show={show} onHide={() => showHideModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Manager</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
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
            <Button className="btn btn-dark" variant="secondary" onClick={() => showHideModal(false)}>
              Cancel
            </Button>
            <Button className="btn btn-dark"
              variant="primary"
              onClick={() => {
                addOrEdit(managerModal);
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};
export default ProjectManager;
