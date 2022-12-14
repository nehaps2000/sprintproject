import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect, useRef } from "react";
import Edit from "../custom-icons/Edit";
import Delete from "../custom-icons/Delete";
import Add from "../custom-icons/Add";
import api from "../utility/api";
import { useParams } from "react-router-dom";

const Allocations = () => {
  const params = useParams();
  const url = `/api/Allocation/SearchAllocation/${params.Id}`;
  const url2 = `/api/Resource/SearchResource/${params.Id}`;
  const url3 = `/api/Team/SearchTeam/${params.Id}`;
  const [allocationList, setAllocationList] = useState([]);
  const [allocationModal, setAllocationModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  console.log(allocationModal);

  const hoursPerDay = useRef("");
  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let response2 = await api("get", url2);
      let response3 = await api("get", url3);
      setAllocationList(response);
      setAllEmployees(response2);
      setAllTeam(response3);
      let temp = response2.map((currentValue) => {
        let tempRes = {
          value: currentValue.name.trim(),
          label: currentValue.id,
        };

        return tempRes;
      });
      setEmployeeList(temp);

      let temp2 = response3.map((teamValue) => {
        let tempRes2 = {
          value: teamValue.name.trim(),
          label: teamValue.id,
        };
        return tempRes2;
      });
      setTeamList(temp2);
    };
    apiCall();
  }, [url]);
  console.log("list", employeeList);

  let role = localStorage.getItem("role");

  const addOrEdit = (allocationModal) => {
    if (!isEdit) {
      const addUrl = `/api/Allocation/AddAllocation`;
      allocationModal.projectId = params.Id;
      allocationModal.hoursPerDay = parseInt(hoursPerDay.current.value);
      console.log(allocationModal);

      const apiCall = async () => {
        let response = await api("post", addUrl, allocationModal);
        if (response) {
          let res = await api("get", url);
          setAllocationList(res);
        }
      };
      apiCall();
    } else {
      const editurl = `/api/Allocation/UpdateAllocation/${allocationModal.id}`;
      const apiCall = async () => {
        let response = await api("patch", editurl, allocationModal);
        response = await api("get", url);
        setAllocationList(response);
      };
      apiCall();
    }

    setShow(false);
    setAllocationModal({});
  };
  const deleteOneAllocation = (allocationModal) => {
    const delurl = `/api/Allocation/DeleteAllocation/${allocationModal.id}`;
    const apiCall = async () => {
      let response = await api("delete", delurl);
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
  const handleChange1 = ({ target: { name, value } }) => {
    console.log(allTeam);
    console.log(value, "value");
    setAllocationModal((prev) => ({
      ...prev,
      [name]: value,
      teamId: allTeam.find((e) => e.name.trim() === value)?.id,
    }));
  };
  const handleChange2 = ({ target: { name, value } }) => {
    setAllocationModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    console.log(allTeam);
    console.log(value, "value");
    setAllocationModal((prev) => ({
      ...prev,
      [name]: value,
      employeeId: allEmployees.find((e) => e.name.trim() === value)?.employeeId,
    }));

    console.log(allEmployees, "hai");
    console.log(allTeam, "helloo");
  };

  return (
    <div>
      <table className="allocation">
        <tr>
          <th>SL NO</th>
          <th>ProjectID</th>
          <th>Name</th>
          <th>EmployeeId</th>
          <th>TeamId</th>
          <th>TeamName</th>
          <th>Hours</th>
          {role === "0" || role === "4" ? <th>Actions</th> : <></>}
        </tr>
        {allocationList?.map((allocation) => {
          return (
            <tr key={allocation.projectId}>
              <td>{allocation.id}</td>
              <td>{allocation.projectId}</td>
              <td> {allocation.name}</td>
              <td> {allocation.employeeId}</td>
              <td> {allocation.teamId}</td>
              <td> {allocation.teamName}</td>
              <td> {allocation.hoursPerDay}</td>
              {role === "0" || role === "4" ? (
                <td>
                  <span>
                    <Edit
                      onClick={() => {
                        editview(allocation);
                      }}
                    />
                  </span>
                  <span>
                    <Delete
                      onClick={() => {
                        deleteAllocation(allocation);
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
      {role === "0" || role === "4" ? (
        <div className="add">
          <Add
            onClick={() => {
              showHideModal(true);
            }}
          />
        </div>
      ) : (
        <div></div>
      )}
      <Modal show={show} onHide={() => showHideModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add new"} Allocations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>

              <select
                className="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange}
                value={allocationModal?.name}
                name="name"
              >
                <option selected>Choose...</option>
                {employeeList.map((name) => (
                  <option key={name.value} id={name.label} value={name.value}>
                    {name.value}
                  </option>
                ))}
              </select>

              <br></br>
              <Form.Label>EmployeeId</Form.Label>
              <input
                name="employeeId"
                value={allocationModal.employeeId || ""}
                onChange={handleChange}
              ></input>
              <br></br>

              <Form.Label>TeamName</Form.Label>

              <select
                className="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange1}
                value={allocationModal?.Id}
                name="teamName"
              >
                <option selected>Choose...</option>
                {teamList.map((teamName) => (
                  <option
                    key={teamName.value}
                    id={teamName.label}
                    value={teamName.value}
                  >
                    {teamName.value}
                  </option>
                ))}
              </select>

              <br></br>
              <Form.Label>TeamId</Form.Label>
              <input
                name="teamId"
                value={allocationModal.teamId || ""}
                onChange={handleChange1}
              ></input>
              <br></br>

              <Form.Label>Hoursperday</Form.Label>
              <input
                name="hoursPerDay"
                value={allocationModal.hoursPerDay || ""}
                ref={hoursPerDay}
                type="number"
                onChange={handleChange2}
              ></input>
              <br></br>

              <Form.Label>ProjectID</Form.Label>
              <input name="projectId" value={params.Id} disabled></input>

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
          <Button className="btn btn-dark"
            onClick={() => deleteOneAllocation(allocationModal)}
          >
            yes
          </Button>
          <Button className="btn btn-dark"  onClick={() => showConfirmModel(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Allocations;
