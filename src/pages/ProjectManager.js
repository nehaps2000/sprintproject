import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Delete from "../custom-icons/Delete";
import Edit from "../custom-icons/Edit";
import Add from "../custom-icons/Add";
import api from "../utility/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProjectManager = () => {
  const params = useParams();
  console.log(params);
  const url = `/api/Allocation/GetScrumMasters`;
  console.log(params.Id);
  const [managerList, setManagerList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [managerModal, setManagerModal] = useState({});
  const [del, setDel] = useState(false);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setManagerList(response);
    };
    apiCall();
  }, [url]);

  const editManager = (currentResource) => {
    setManagerModal({ ...currentResource });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteManager= (currentResource) => {
    setManagerModal({ ...currentResource });
    showDeleteModal(true);
  };

  const addOrEdit = (managerModal) => {
    const addurl = `/api/Allocation/ProjectManager`;
    console.log(managerModal);
    managerModal.projectId = params.Id;
    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl, managerModal);
        if (response) {
          let response1 = await api("get", url);
          setManagerList(response1);
        }
      };
      apiCall();
    } else {
      const apiCall = async () => {
        const editUrl = `/api/Resource/updateResource/${managerModal.projectId}`;
        let response = await api("patch", editUrl, managerModal);
        if (response) {
          let res = await api("get", url);
          setManagerList(res);
        }
      };
      apiCall();
    }
    setManagerModal({});
    setShow(false);
  };

  const deleteOneManager = (managerModal) => {
    const delUrl = `/api/Resource/DeleteResource/${managerModal.projectId}`;
    const apiCall = async () => {
      let response = await api("delete", delUrl);
      if (response) {
        let res = await api("get", url);
        setManagerList(res);
      }
    };
    apiCall();

    setDel(false);
    setManagerModal({});
  };

  const showDeleteModal = (status) => {
    setDel(status);
  };

  const showHideModal = (status) => {
    setShow(status);
    if (!status) setManagerModal({});
    setIsEdit(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    setManagerModal((prev) => {
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
      <table className="team">
        <tr>
        
          <th>Employee ID</th>
          <th>Email</th>
          <th>Name</th>
        

          {/* <th>Actions</th> */}
        </tr>
        {managerList?.map((manager) => {
          return (
            <tr key={manager.projectId}>
             
              <td>{manager.employeeId}</td>
              <td>{manager.email}</td>
              <td>{manager.name}</td>
             

              {/* <td>
                <span>
                  <Edit
                    onClick={() => {
                      editManager(manager);
                    }}
                  />
                </span>
                <span>
                  <Delete
                    onClick={() => {
                      deleteManager(manager);
                    }}
                  />
                </span>
              </td> */}
            </tr>
          );
        })}
      </table>

      <div>
        <Add
          className="add"
          onClick={() => {
            showHideModal(true);
          }}
        />
      </div>

      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add"} resources</Modal.Title>
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
              {/* <Form.Label>Email</Form.Label> */}
              {/* <input
                name="email"
                value={managerModal.email || ""}
                onChange={handleChange}
              ></input> */}
              {/* <br></br>
              <Form.Label>Name</Form.Label>
              <input
                name="name"
                value={managerModal.name || ""}
                onChange={handleChange}
              ></input>
              <br></br> */}
              {/* <Form.Label>ProjectID</Form.Label>
              <input name="projectId" value={params.Id} disabled></input>
              <br></br> */}
              {/* <Form.Label>Designation</Form.Label>
              <select
                className="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange}
                value={managerModal?.designation}
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
              </select> */}
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
              addOrEdit(managerModal);
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
              deleteOneManager(managerModal);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ProjectManager;