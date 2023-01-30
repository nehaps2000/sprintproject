import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import Add from "../custom-icons/Add";
import api from "../utility/api";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { Container, Row, Col } from "react-bootstrap";
import Spinner from "../components/Spinner";
const Holiday = () => {
  const url = "/api/Calendar/GetHoliday";
  const [holidayList, setHolidayList] = useState([]);
  const [holidayModal, setHolidayModal] = useState({});
  const [addHolidayModal, setAddHolidayModal] = useState(false);
  const [holidaySet, setHoliday] = useState({
    list: {},
    keys: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiCall = async () => {
      let response = await api("get", url);
      setHolidayList(response);
      holidayGrouping(holidayList);
      setIsLoading(false);
    };
    apiCall();
  }, [url, holidayList]);

  const handleHolidayChange = ({ target: { name, value } }) => {
    setHolidayModal((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const showHolidayModal = (status) => {
    setAddHolidayModal(status);
    if (!status) setHolidayModal({});
  };

  const addHoliday = async (holidayModal) => {
    const addHolidayUrl = `/api/Calendar/AddHoliday`;
    let response = await api("post", addHolidayUrl, holidayModal);
    if (response) {
      let res2 = await api("get", url);
      setHolidayList(res2);
    }
    setAddHolidayModal(false);
    setHolidayModal({});
  };

  const holidayGrouping = (holidayList) => {
    let d = {};
    holidayList.forEach((holiday) => {
      var date = holiday.date;
      var year = date.split("-")[date.split("-").length - 1];
      const keys = Object.keys(d);
      if (keys.includes(year)) {
        d[`${year}`].push({
          name: holiday.name,
          date,
        });
      } else if (!keys.includes(year)) {
        d[`${year}`] = [];
        d[`${year}`].push({
          name: holiday.name,
          date,
        });
      }
    });
    setHoliday({
      list: d,
      keys: Object.keys(d),
    });
  };

  return (
    <>
      <Container>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <Row>
              {localStorage.getItem("role") === "4" ? (
                <Col>
                  <div className="add">
                    <Add
                      onClick={() => {
                        showHolidayModal(true);
                      }}
                    />
                  </div>
                </Col>
              ) : (
                <div></div>
              )}
            </Row>
            <Row>
              <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                {holidaySet.keys.map((key) => {
                  return (
                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>{key}</AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <ul>
                          {holidaySet.list[`${key}`].map((data) => {
                            return (
                              <li className="accList" key={data.date}>
                                <b>{data.name}</b> <i>{data.date}</i>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionItemPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Row>
          </div>
        )}
      </Container>

      <Modal show={addHolidayModal} onHide={() => showHolidayModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add new holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Date</Form.Label>
              <input
                name="date"
                className="form-label"
                for="formControlDisabled"
                type="date"
                onChange={handleHolidayChange}
                value={holidayModal?.date}
              ></input>
              <Form.Label>Name</Form.Label>
              <input
                name="name"
                value={holidayModal?.name}
                onChange={handleHolidayChange}
              ></input>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-dark"
            variant="secondary"
            onClick={() => showHolidayModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-dark"
            variant="primary"
            onClick={() => {
              addHoliday(holidayModal);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Holiday;
