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

const Resource = () => {
  const params = useParams();
  console.log(params);
  const url = `/api/Resource/SearchResource/${params.Id}`;
  console.log(params.Id);
  const [resourceList, setResourceList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [resourceModal, setResourceModal] = useState({});
  const [del, setDel] = useState(false);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setResourceList(response);
    };
    apiCall();
  }, [url]);

  let role = localStorage.getItem("role");

  const editResource = (currentResource) => {
    setResourceModal({ ...currentResource });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteResource = (currentResource) => {
    setResourceModal({ ...currentResource });
    showDeleteModal(true);
  };

  const addOrEdit = (resourceModal) => {
    const addurl = `/api/Resource/AddResource`;
    console.log(resourceModal);
    resourceModal.projectId = params.Id;
    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl, resourceModal);
        if (response) {
          let response1 = await api("get", url);
          setResourceList(response1);
        }
      };
      apiCall();
    } else {
      const apiCall = async () => {
        const editUrl = `/api/Resource/updateResource/${resourceModal.id}`;
        let response = await api("patch", editUrl, resourceModal);
        if (response) {
          let res = await api("get", url);
          setResourceList(res);
        }
      };
      apiCall();
    }
    setResourceModal({});
    setShow(false);
  };

  const deleteOneResource = (resourceModal) => {
    const delUrl = `/api/Resource/DeleteResource/${resourceModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", delUrl);
      if (response) {
        let res = await api("get", url);
        setResourceList(res);
      }
    };
    apiCall();

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

  // const options = [
  //   {
  //     0: "ScrumMaster"
  //   },
  //   {
  //     1: "Lead"
  //   },
  //   {
  //     2: "Developer"
  //   },
  //   {
  //     3: "QA Engineer"
  //   },
  //   {
  //     4: "Admin"
  //   },
  // ];

  const options = {
    0: {
      name: "ScrumMaster",
    },
    1: {
      name: "Lead",
    },
    2: {
      name: "Developer",
    },
    3: {
      name: "QA Engineer",
    },
    4: {
      name: "Admin",
    },
  };

  return (
    <div>
      {role === "0" || role === "4" ? (
        <div>
          <Add
            className="add"
            onClick={() => {
              showHideModal(true);
            }}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="main">
        <table className="team">
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            {role === "0" || role === "4" ? <th>Actions</th> : <></>}
          </tr>
          {resourceList?.map((resources) => {
            return (
              <tr key={resources.id}>
                <td>{resources.id}</td>
                <td>{resources.employeeId}</td>
                <td>{resources.email}</td>
                <td>{resources.name}</td>
                <td>{resources.role}</td>

                {role === "0" || role === "4" ? (
                  <td>
                    <span>
                      <Edit
                        onClick={() => {
                          editResource(resources);
                        }}
                      />
                    </span>
                    <span>
                      <Delete
                        onClick={() => {
                          deleteResource(resources);
                        }}
                      />
                    </span>
                  </td>
                ) : (
                  <></>
                )}
              </tr>
            );
          })}
        </table>

        <Modal show={show} onHide={() => showHideModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{isEdit ? "Edit" : "Add"} resources</Modal.Title>
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
                  value={resourceModal.employeeId || ""}
                  onChange={handleChange}
                ></input>
                <br></br>
                <Form.Label>Email</Form.Label>
                <input
                  name="email"
                  value={resourceModal.email || ""}
                  onChange={handleChange}
                ></input>
                <br></br>
                <Form.Label>Name</Form.Label>
                <input
                  name="name"
                  value={resourceModal.name || ""}
                  onChange={handleChange}
                ></input>
                <br></br>
                <Form.Label>ProjectID</Form.Label>
                <input name="projectId" value={params.Id} disabled></input>
                <br></br>
                <Form.Label>Role</Form.Label>
                <select
                  className="custom-select"
                  id="inputGroupSelect04"
                  onChange={handleChange}
                  value={resourceModal?.role}
                  name="role"
                >
                  <option selected>Choose...</option>
                  {/* {options.forEach((option,key) => (
                  <option
                    key={key}
                    id={option.value}
                    value={key}
                  >
                    {option[key].name}
                  </option>
                ))} */}
                  {Object.keys(options).map((key) => (
                    <option key={key} value={key}>
                      {options[key].name}
                    </option>
                  ))}
                </select>
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
            <Button className="btn btn-dark" variant="secondary" onClick={() => showDeleteModal(false)}>
              Cancel
            </Button>
            <Button className="btn btn-dark"
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
    </div>
  );
};
export default Resource;
