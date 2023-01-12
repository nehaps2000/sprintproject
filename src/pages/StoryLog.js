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
import { Container, Row, Col } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";

const StoryLog = () => {
  const params = useParams();
  const url = `/api/Story/SearchStory/${params.Id}`;
  const newUrl = `/api/Story/StoriesLeft/${params.Id}`;
  const [checked, setChecked] = useState([]);
  const [storyList, setStoryList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [storyModal, setStoryModal] = useState({});
  const [show, setShow] = useState(false);
  const [del, setDel] = useState(false);
  const [unusedList, setUnusedList] = useState([]);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let response1 = await api("get", newUrl);
      setStoryList(response);
      setUnusedList(response1);
    };
    apiCall();
  }, [url]);

  let role = localStorage.getItem("role");
  let sprint = localStorage.getItem("sprintId");
  const addOrEdit = (storyModal) => {
    const addurl = `/api/Story/AddStory`;
    storyModal.projectId = params.Id;

    console.log(storyModal.sprintId, "monkey");
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
  const checkuse = (item) => {
    for (let story of unusedList) {
      if (item.id === story.id) {
        return false;
      }
    }
    return true;
  };

  const handleCheck = (e, item) => {
    var updatedList = [...checked];
    if (e.target.checked) {
      updatedList = [...checked, { sprintId: params.sprintId, id: item.id }];

      setChecked(updatedList);
    } else {
      let updated = updatedList.filter((a) => a.id !== item.id);

      console.log(updated, "cat");
      setChecked(updated);
    }
  };

  console.log(checked, "pen");

  const saveStory = () => {
    const addStoryUrl = `/api/Story/AddStorytoSprint`;
    const apiCall = async () => {
      const respose = await api("patch", addStoryUrl, checked);

      if (respose) {
        console.log(respose, "pencil");
        const stories = await api("get", url);
        setStoryList(stories);
        console.log(storyList, "neha");
      }
    };
    apiCall();
    setChecked([]);
  };

  return (
    <>
      <div className="card-header">
        <Navbar></Navbar>
      </div>
      <Container>
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
          <h1 className={checked.length > 0 ? "checked" : "notChecked"}>
            Listed Story
          </h1>
          {checked?.map((item) => {
            console.log(item, "hhh");
            return (
              <div className="list">
                <ListGroup>
                  <ListGroup.Item>
                    {storyList.find((s) => s.id === item.id)?.name}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            );
          })}
        </Row>
        <Row>
          {checked.length > 0 ? (
            <Button
              className="btn btn-dark"
              onClick={() => {
                saveStory();
              }}
            >
              Save Story
            </Button>
          ) : (
            <></>
          )}
        </Row>
        <Row>
          <h1 className="stories">Stories</h1>
          <div className="story">
            {storyList?.map((item, index) => {
              const style = checkuse(item)
                ? { display: "none" }
                : { display: "block" };
              console.log(item);
              return (
                <>
                  <div key={index} className="border" style={style}>
                    <div className="names">
                      {item.id} {item.name}
                      {role === "0" || role === "4" ? (
                        <div className="click">
                          <Form.Check
                            className="clicked"
                            value={` ${item.name}`}
                            type="checkbox"
                            onChange={(e) => handleCheck(e, item)}
                            id={item.id}
                          ></Form.Check>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    {role === "0" || role === "4" ? (
                      <div className="operations">
                        <span className="option">
                          <Delete
                            onClick={() => {
                              deleteStory(item);
                            }}
                          />
                        </span>
                        <span className="option">
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
                  </div>
                </>
              );
            })}{" "}
          </div>
        </Row>
      </Container>

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
              <Form.Label>ProjectID</Form.Label>
              <input name="projectId" value={params.Id} disabled></input>

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