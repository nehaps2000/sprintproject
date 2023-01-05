import { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import api from "../utility/api";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Add from "../custom-icons/Add";
import Edit from "../custom-icons/Edit";
import Delete from "../custom-icons/Delete";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hamburger from "../components/Hamburger";
const StoryLog = () => {
  const params = useParams();
  const url = `/api/Story/SearchStory/${params.Id}`;

  const [checked, setChecked] = useState([]);
  const [storyList, setStoryList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [storyModal, setStoryModal] = useState({});
  const [saveButton, setSaveButton] = useState(false);
  const [show, setShow] = useState(false);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);

      setStoryList(response);
    };
    apiCall();
  }, [url]);

  let role = localStorage.getItem("role");
  const addOrEdit = (storyModal) => {
    const addurl = `/api/Story/AddStory`;
    storyModal.projectId = params.Id;
    storyModal.SprintId = params.Id;
    console.log(params.Id, "monkey");
    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl, storyModal);
        response = await api("get", url);
        setStoryList(response);
        showHideModal(false);
      };
      apiCall();
    } else {
      const updateurl = `/api/Story/UpdateStory/${storyModal.id}`;
      const apiCall = async () => {
        let response = await api("patch", updateurl, storyModal);
        if (response) {
          let res = await api("get", url);
          setStoryList(res);
          console.log(setStoryList);
          showHideModal(false);
        }
      };
      apiCall();
    }

    setStoryModal(false);
    setShow({});
  };

  const deleteOneStory = (storyModal) => {
    const deleteurl = `/api/Story/DeleteStory/${storyModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", deleteurl);
      if (response) {
        let res = await api("get", url);
        setStoryList(res);
      }
    };
    apiCall();
    setDel(false);
    setStoryModal({});
  };
  const showHideModal = (status) => {
    setShow(status);
    if (!status) setStoryModal({});
    setIsEdit(false);
  };
  const showDeleteModal = (status) => {
    setDel(status);
  };
  const editStory = (currentStory) => {
    setStoryModal({ ...currentStory });

    showHideModal(true);
    setIsEdit(true);
  };

  const deleteStory = (currentResource) => {
    setStoryModal({ ...currentResource });
    showDeleteModal(true);
  };
  const handleChange = ({ target: { name, value } }) => {
    setStoryModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
      setSaveButton(true);
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
      // setSaveButton(false);
    }
    setChecked(updatedList);
  };

  const saveStory = () => {
    const addStoryUrl = `/api/Story/AddStorytoSprint`;
    const apiCall = async () => {
      await api("post", addStoryUrl, checked);
      apiCall();
    };
  };

  return (
    <>
      <div className="card-header">
        <Navbar></Navbar>
        <Hamburger></Hamburger>
      </div>
      <div className="app">
        <div className="checkList">
          <div className="title">
            <h1>Story Selected</h1>
          </div>
          <div className="list-container">
            <div className="return">
              {/* {checked.length =0 ? setSaveButton(false) : setSaveButton(true)} */}
              <h1 className={checked.length > 0 ? "checked" : "notChecked"}>
                Listed Story
              </h1>
              {checked?.map((item) => {
                console.log(item);
                return (
                  <div className="list">
                    <ListGroup>
                      <ListGroup.Item>{item}</ListGroup.Item>
                    </ListGroup>
                  </div>
                );
              })}
              {saveButton ? (
                <Button onClick={saveStory()}>Save Story</Button>
              ) : (
                <></>
              )}
            </div>
            <h1>Stories</h1>
            <div className="story">
              {storyList?.map((item, index) => {
                console.log(item);
                return (
                  <>
                    <div key={index} className="border">
                      <span>
                        {item.id} {item.name}
                        {role === "0" || role === "4" ? (
                          <div>
                            <input
                              value={`${item.id} ${item.name}`}
                              type="checkbox"
                              onChange={handleCheck}
                              id={item.id}
                            ></input>
                          </div>
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>
                    {role === "0" || role === "4" ? (
                      <div>
                        <span>
                          <Delete
                            onClick={() => {
                              deleteStory(item);
                            }}
                          />
                        </span>
                        <span>
                          <Edit
                            onClick={() => {
                              editStory(item);
                            }}
                          />
                        </span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </>
                );
              })}{" "}
            </div>
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
          </div>
        </div>
      </div>
      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add new"} Story</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <input
                name="name"
                value={storyModal.name || " "}
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
              addOrEdit(storyModal);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={del} onHide={() => showDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete </Modal.Title>
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
              deleteOneStory(storyModal);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoryLog;
