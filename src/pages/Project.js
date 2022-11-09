import React from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const Project = () => {
  const url = "https://run.mocky.io/v3/1c83774d-0906-4ea8-9368-49f78ae0f37a";
  const [projectList, setProjectList] = useState([]);
  const [projectModal, setProjectModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(false);
  useEffect(() => {
    axios.get(url).then((response) => {
      setProjectList(response.data);
    });
  }, [url]);

  const addOrEdit = () => {
    if (!isEdit) {
      setProjectList((prev) => {
        return [...prev, { ...projectModal, id: Date.now()}];
      });
    } else {
      const index = projectList.findIndex(
        (project) => project.id === projectModal.id
      );
      setProjectList((prev) => {
        return [
          ...prev.slice(0, index),
          { ...projectModal },
          ...prev.slice(index + 1),
        ];
      });
    }
    
    setShow(false);
    setProjectModal({});
  };

  const deleteOneProject = (projectModal) => {

    const index = projectList.findIndex((project) => project.id ===projectModal.id);
    setProjectList((prev)=>
    {
      return[
        ...prev.slice(0, index),
        ...prev.slice(index + 1),
      ]
    })
    setAlert(false)
    setProjectModal({})
  };

  const showHideModal = (status) => {
    setShow(status);
    if (!status) 
    setProjectModal({});
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

  const deleteProject = (currentProject) =>{
    setProjectModal({...currentProject});
    showConfirmModel(true);

  }

  const handleChange = ({ target: { name, value } }) => {
    setProjectModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div>
      
        <table className="table">
          <tr>
            <th>Name</th>
            <th>id</th>
            <th>Actions</th>
          </tr>
          {projectList?.map((project) => {
            return (
              <tr key={project.id}>
                <td> {project.name}</td>
                <td> {project.id}</td>
                <td>
                  <span>
                    <button
                      className="xx"
                      onClick={() => {
                        editview(project);
                      }}
                    >
                      <EditOutlined />
                    </button>
                  </span>
                  <span>
                    <button
                      className="xx"
                      onClick={() => {
                        deleteProject(project);
                      }
                    }
                    >
                      {" "}
                      <DeleteOutlined />
                    </button>
                  </span>
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
          <Modal.Title>Add new project</Modal.Title>
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
