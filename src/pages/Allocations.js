import React from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const Allocations = () => {
  const url = "https://run.mocky.io/v3/36a41f98-356e-4182-aab1-775429653f4f";
  const [allocationList, setAllocationList] = useState([]);
  const [allocationModal, setAllocationModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    axios.get(url).then((response) => {
      setAllocationList(response.data);
    });
  }, [url]);

  const addOrEdit = () => {
    if (!isEdit) {
      setAllocationList((prev) => {
        return [...prev, { ...allocationModal, id: Date.now() }];
      });
    } else {
      const index = allocationList.findIndex(
        (allocation) => allocation.id === allocationModal.id
      );
      setAllocationList((prev) => {
        return [
          ...prev.slice(0, index),
          { ...allocationModal },
          ...prev.slice(index + 1),
        ];
      });
    }

    setShow(false);
    setAllocationModal({});
  };

  const deleteOneAllocation = (allocationModal) => {
    const index = allocationList.findIndex(
      (allocation) => allocation.id === allocationModal.id
    );
    setAllocationList((prev) => {
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
    setAlert(false);
    setAllocationModal({});
  };

  const showHideModal = (status) => {
    setShow(status);
    if (!status) setAllocationModal({});
    setIsEdit(false);
  };

  const showConfirmModel = (status) => {
    setAlert(status);
  };

  const editview = (currentProject) => {
    setAllocationModal({ ...currentProject });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteAllocation = (currentAllocation) => {
    setAllocationModal({ ...currentAllocation });
    showConfirmModel(true);
  };

  const handleChange = ({ target: { name, value } }) => {
    setAllocationModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div>
      <table className="table">
        <tr>
          <th>id</th>
          <th>EmployeeID</th>
          <th>TeamID</th>
          <th>ProjectID</th>
          <th>Role</th>
          <th>Hours</th>

          <th>Actions</th>
        </tr>
        {allocationList?.map((allocation) => {
          return (
            <tr key={allocation.id}>
              <td>{allocation.id}</td>
              <td> {allocation.employeeId}</td>
              <td> {allocation.teamId}</td>
              <td> {allocation.projectId}</td>
              <td> {allocation.role}</td>
              <td> {allocation.hoursperday}</td>

              <td>
                <span>
                  <button
                    className="xx"
                    onClick={() => {
                      editview(allocation);
                    }}
                  >
                    <EditOutlined />
                  </button>
                </span>
                {
                  <span>
                    <button
                      className="xx"
                      onClick={() => {
                        deleteAllocation(allocation);
                      }}
                    >
                      {" "}
                      <DeleteOutlined />
                    </button>
                  </span>
                }
              </td>
            </tr>
          );
        })}
      </table>

      <Button className="primary" onClick={() => showHideModal(true)}>
        Add
      </Button>

      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add new Allocations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Role</Form.Label>
              <input
                name="role"
                value={allocationModal.role || " "}
                onChange={handleChange}
              ></input>
              <br></br>
              <Form.Label>Hours per day</Form.Label>
              <input
                name="hoursperday"
                value={allocationModal.hoursperday || " "}
                onChange={handleChange}
              ></input>
              <br></br>

              <Form.Label>EmployeeID</Form.Label>
              <input
                name="employeeId"
                value={allocationModal.employeeId || " "}
                onChange={handleChange}
              ></input>
              <br></br>

              <Form.Label>Team</Form.Label>
              {/* <input
                name="teamId"
                value={allocationModal.teamId || " "}
                onChange={handleChange}
              ></input> */}

              <select class="custom-select" id="teamId">
                <option selected onChange={handleChange} value={allocationModal}>select...</option>
                <option value="1">FrontEnd</option>
                <option value="2">Backend</option>
                <option value="3">Testing</option>
              </select>

              <br></br>

              <Form.Label>Project</Form.Label>
              {/* <input
                name="projectId"
                value={allocationModal.projectId || " "}
                onChange={handleChange}
              ></input> */}
              <br></br>
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
              addOrEdit(allocationModal);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={alert} onHide={() => showConfirmModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Allocation?</Modal.Title>
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
            onClick={() => deleteOneAllocation(allocationModal)}
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

export default Allocations;
