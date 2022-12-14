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
  const url2 = `/api/Resource/SearchResource/${params.Id}`;
  const url3= `/api/Team/SearchTeam/${params.Id}`;
  const [allocationList, setAllocationList] = useState([]);
  const [allocationModal, setAllocationModal] = useState({});
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(false);
  const [employeeList,setEmployeeList] = useState([]);
  const [teamList,setTeamList]=useState([])
  console.log(allocationModal);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      let response2= await api("get",url2);
      let response3=await api("get",url3)
      setAllocationList(response);
      let temp =response2.map((currentValue)=>{
        let tempRes={value:currentValue.name.trim(),
        label:currentValue.Id}
        console.log("label","neha")
        return tempRes
      })
      setEmployeeList(temp)
      console.log("temp" ,temp)
      console.log('allocation',response)
      let temp2 =response3.map((teamValue)=>{
        let tempRes2={'value':teamValue.name.trim(),
      "label":teamValue.Id}
      return tempRes2
      })
      setTeamList(temp2)
    };
    apiCall();
  }, [url]);

  const addOrEdit = (allocationModal) => {
    if (!isEdit) {
      const addUrl = `/api/Allocation/AddAllocation`;
      allocationModal.projectId=params.Id;
    //  allocationModal.projectName=params.name;
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

  const handleChange = ({ target: { name, value} }) => {
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
                {employeeList.map((employee) => (
                  
                  <option
                    key={employee.value}
                    id={employee.label}
                    value={employee.label}
                  >
                    {employee.value}{console.log('current',employee)}
                  </option>
                ))}
              </select>

              <br></br>

              <Form.Label>Team</Form.Label>

              {/* <select
                className="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange}
                value={allocationModal?.teamId}
                name="teamId"
              >
                <option selected>Choose...</option>
                {teamList.map((team) => (
                  <option
                   key={team.value}
                    id={team.value}
                     value={team.value}
                     >
                    {team.value}{console.log('current1',team)}
                  </option>
                ))}
              </select> */}


<select
                className="custom-select"
                id="inputGroupSelect04"
                onChange={handleChange}
                value={allocationModal?.teamId}
                
                name="teamId"
              >
                <option selected>Choose...</option>
                {teamList.map((team) => (
                  
                  <option
                    key={team.value}
                    id={team.label}
                    value={team.label}
                  >
                    {team.value}{console.log('current1',team)}
                  </option>
                ))}
              </select>



              <br></br>

              <Form.Label>Project</Form.Label>

  
              <input
                name="ProjectId"
                value={allocationList.project|| params.Id}
               
                disabled
              ></input>
{console.log(allocationModal)}
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
