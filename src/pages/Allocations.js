import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Edit from "./Edit";
import Delete from "./Delete";
import Add from "./Add";
import api from "../utility/api";
import { useParams } from "react-router-dom";

const Allocations = () => {
  const params = useParams();
  console.log(params);
  const url = `/api/Allocation/SearchAllocation/${params.Id}`;
  const [allocationList, setAllocationList] = useState([]);
  const [allocationModal, setAllocationModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(false);
  console.log(allocationModal);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setAllocationList(response);
    };
    apiCall();
  }, [url]);

  const addOrEdit = (allocationModal) => {
    if (!isEdit) {
      const addUrl = `/api/Allocation/AddAllocation`;
      const apiCall = async () => {
        let response = await api("post", addUrl, allocationModal);
        if (response) {
          let res = await api("get", url);
          setAllocationList(res);
        }
      };
      apiCall();
    } else {
      const url = `/api/Allocation/UpdateAllocation/${allocationModal.id}`;
      const apiCall = async () => {
        let response = await api("patch", url, allocationModal);
        response = await api("get", url);
        setAllocationList(response);
      };
      apiCall();
    }

    setShow(false);
    setAllocationModal({});
  };


  const team = [
    {
      label: "frontend",
      value: "1",
    },
    {
      label: "backend",
      value: "2",
    },
    {
      label: "testing",
      value: "3",
    },
  ];

  const employee = [
    {
      label: "Neha",
      value: "G123",
    },
    {
      label: "Nasrulla",
      value: "G212",
    },
    {
      label: "Dathan",
      value: "G323",
    },
  ];

  const deleteOneAllocation = (allocationModal) => {
    const url = `/api/Allocation/DeleteAllocation/${allocationModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", url);
      if (response) {
        let res = await api("get", url);
        setAllocationList(res);
      }
    };
    apiCall();
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
      return {
        ...prev,
        [name]: name === "employeeId" ? value : parseInt(value),
      };
    });
  };

  return (
    <div>
      <table>
        <tr>
          <th>SL.no</th>
          <th>Employee</th>
          <th>Team</th>
          <th>Project</th>
          <th>Role</th>
          <th>Hours</th>

          <th>Actions</th>
        </tr>
        {allocationList?.map((allocation) => {
          return (
            <tr key={allocation.value}>
              <td>{allocation.id}</td>
              <td> {allocation.employee}</td>
              <td> {allocation.team}</td>
              <td> {allocation.project}</td>
              <td> {allocation.role}</td>
              <td> {allocation.hoursperday}</td>

              <td>
                <span>
                  <Edit onClick={() => editview(allocation)} />
                </span>
                {
                  <span>
                    <Delete onClick={() => deleteAllocation(allocation)} />
                  </span>
                }
              </td>
            </tr>
          );
        })}
      </table>
      <div className="add">
        <Add
          className="add"
          onClick={() => {
            showHideModal(true);
          }}
        />
      </div>
      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add new"} Allocations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Role</Form.Label>
              <input
                name="role"
                value={allocationModal.role || ""}
                onChange={handleChange}
              ></input>
              <br></br>
              <Form.Label>Hoursperday</Form.Label>
              <input
                name="hoursperday"
                value={allocationModal.hoursperday || ""}
                onChange={handleChange}
              ></input>
              <br></br>

              <Form.Label>employee</Form.Label>

              <select
                className="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange}
                value={allocationModal?.employeeId}
                name="employeeId"
              >
                <option selected>Choose...</option>
                {employee.map((employee) => (
                  <option
                    key={employee.value}
                    id={employee.value}
                    value={employee.value}
                  >
                    {employee.label}
                  </option>
                ))}
              </select>

              <br></br>

              <Form.Label>Team</Form.Label>

              <select
                className="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange}
                value={allocationModal?.teamId}
                name="teamId"
              >
                <option selected>Choose...</option>
                {team.map((team) => (
                  <option key={team.label} id={team.value} value={team.value}>
                    {team.label}
                  </option>
                ))}
              </select>

              <br></br>

              <Form.Label>Project</Form.Label>

              {/* <select
                className="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange}
                value={allocationModal?.projectId}
                name="projectId"
              >
                <option selected>Choose...</option>
                {project.map((project) => (
                  <option
                    key={project.value}
                    id={project.value}
                    value={project.value}
                  >
                    {project.label}
                  </option>
                ))}
              </select> */}

              <input
                name="ProjectId"
                value={params.Id}
                disabled
              ></input>

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
