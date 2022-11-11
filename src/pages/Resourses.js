import React from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Delete from "./Delete";
import Edit from "./Edit";
import Add from "./Add";

import { useState, useEffect } from "react";

const Resource = () => {
  const url = "https://run.mocky.io/v3/93f4c336-68ce-4950-8119-d9afb0e78e23";
  const [resourceList, setResourceList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [resourceModal, setResourceModal] = useState({});
  const [del, setDel] = useState(false);

  useEffect(() => {
    axios.get(url).then((response) => {
      setResourceList(response.data);
    });
  }, [url]);

  const editResource = (currentResource) => {
    setResourceModal({ ...currentResource });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteResource = (currentResource) => {
    setResourceModal({ ...currentResource });
    showDeleteModal(true);
  };

  const addOrEdit = () => {
    if (!isEdit) {
      setResourceList((prev) => {
        return [...prev, { ...resourceModal, id: Date.now() }];
      });
    } else {
      const index = resourceList.findIndex(
        (resource) => resource.id === resourceModal.id
      );
      setResourceList((prev) => {
        return [
          ...prev.slice(0, index),
          { ...resourceModal },
          ...prev.slice(index + 1),
        ];
      });
    }
    setResourceModal({});
    setShow(false);
  };

  const deleteOneResource = (resourceModal) => {
    const index = resourceList.findIndex(
      (resource) => resource.id === resourceModal.id
    );
    setResourceList((prev) => {
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
    setDel(false);
    setResourceModal({});
  };

  const showDeleteModal = (status) => {
    setDel(status);
  };

  const showHideModal = (status) => {
    setShow(status);
    if (!status) setResourceModal({});
    setIsEdit(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    setResourceModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const options = [
    {
      label: "Frontend Developer",
      value: "1",
    },
    {
      label: "Backend Developer",
      value: "2",
    },
    {
      label: "QA Engineer",
      value: "3",
    },
    {
      label: "DevOps Engineer",
      value: "4",
    },
  ];
  return (
    <div className="main">
      <table>
        <tr>
          <th>ID</th>
          <th>Employee ID</th>
          <th>Name</th>
          <th>Designation</th>
          <th>Actions</th>
        </tr>
        {resourceList?.map((resource) => {
          return (
            <tr key={resource.id}>
              <td>{resource.id}</td>
              <td>{resource.employeeId}</td>
              <td>{resource.name}</td>
              <td>{resource.designation}</td>
              <td>
                <span>
                  <Edit
                    onClick={() => {
                      editResource(resource);
                    }}
                  />
                </span>
                <span>
                  <Delete
                    onClick={() => {
                      deleteResource(resource);
                    }}
                  />
                </span>
              </td>
            </tr>
          );
        })}
      </table>

      <div className="add">
        <Add
          onClick={() => {
            showHideModal(true);
          }}
        />
      </div>

      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add"} resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Employee ID</Form.Label>
              <input
                name="employeeId"
                value={resourceModal.employeeId || " "}
                onChange={handleChange}
              ></input>
              <br></br>
           
              <Form.Label>Name</Form.Label>
              <input
                name="name"
                value={resourceModal.name || " "}
                onChange={handleChange}
              ></input>
              <br></br>
              <Form.Label>Designation</Form.Label>
              <select
                class="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange}
                value={resourceModal?.designation}
                name="designation"
              >
                <option selected>Choose...</option>
                {options.map((option) => (
                  <option
                    key={option.label}
                    id={option.value}
                    value={option.label}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
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
              addOrEdit(resourceModal);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={del} onHide={() => showDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Do you really want to delete ?</Form.Label>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => showDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              deleteOneResource(resourceModal);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Resource;
