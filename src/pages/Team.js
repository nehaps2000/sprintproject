import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Edit from "./Edit";
import Delete from "./Delete";
import Add from "./Add";
import api from "../utility/api";
import { useState, useEffect } from "react";

const Team = () => {
  const url = "/api/Team/Teams";
  const [teamList, setTeamList] = useState([]);
  const [teamModal, setTeamModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setTeamList(response);
    };
    apiCall();
  }, [url]);

  const addOrEdit = (teamModal) => {
    const addurl = `/api/Team/AddTeam`;
    if (!isEdit) {
      const apiCall = async () => {
        let response = await api("post", addurl,teamModal);
        if (response) {
          let response1 = await api("get", url);
          setTeamList(response1);
        }
        // setTeamList((prev) => {
        //   return [...prev, { ...teamModal, response }];
        // });
        // setTeamList(response);

      };
      apiCall();
   
    } else {
      const updateurl=`/api/Team/UpdateTeam/${teamModal.id}`
      // const index = teamList.findIndex((team) => team.id === teamModal.id);
      // setTeamList((prev) => {
      //   return [
      //     ...prev.slice(0, index),
      //     { ...teamModal },
      //     ...prev.slice(index + 1),
      //   ];
      // });
      const apiCall = async () => {
        let response = await api("patch", updateurl,teamModal);
        if (response) {
          let response1 = await api("get", url);
          setTeamList(response1);
        }
      }
      apiCall()

    }
    setTeamModal({});
    setShow(false);
  };

  const deleteOneTeam = (teamModal) => {
    // const index = teamList.findIndex((team) => team.id === teamModal.id);
    // setTeamList((prev) => {
    //   return [...prev.slice(0, index), ...prev.slice(index + 1)];
    // });
    const deleteurl=`/api/Team/DeleteTeam/${teamModal.id}`
    const apiCall = async () => {
      let response = await api("delete", deleteurl);
      
    };
    apiCall();
    setDel(false);
    setTeamModal({});
  };

  const showHideModal = (status) => {
    setShow(status);
    if (!status) setTeamModal({});
    setIsEdit(false);
  };

  const showDeleteModal = (status) => {
    setDel(status);
  };

  const editTeam = (currentTeam) => {
    setTeamModal({ ...currentTeam });
    showHideModal(true);
    setIsEdit(true);
  };

  const deleteTeam = (currentTeam) => {
    setTeamModal({ ...currentTeam });
    showDeleteModal(true);
  };

  const handleChange = ({ target: { name, value } }) => {
    setTeamModal((prev) => {
      return { ...prev, [name]: value };
    });
  };
  return (
    <div>
      <div className="main">
        <table>
          <tr>
            <th>Name</th>
            <th>id</th>
            <th>Actions</th>
          </tr>
          {teamList?.map((team) => {
            return (
              <tr key={team.id}>
                <td> {team.name}</td>
                <td> {team.id}</td>
                <td>
                  <span>
                    <Edit
                      onClick={() => {
                        editTeam(team);
                      }}
                    />
                  </span>
                  <span>
                    <Delete
                      onClick={() => {
                        deleteTeam(team);
                      }}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </table>
        <Add
          className="add"
          onClick={() => {
            showHideModal(true);
          }}
        />
      </div>

      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add/Edit team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <input
                name="name"
                value={teamModal.name || " "}
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
              addOrEdit(teamModal);
             
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={del} onHide={() => showDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete team</Modal.Title>
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
              deleteOneTeam(teamModal);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Team;
