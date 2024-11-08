import Form from "react-bootstrap/Form";
import { taskData as data } from "../FakeData/Data";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { SearchBar } from "../Components/SearchBar";
import { SearchResultsList } from "../Components/SearchResultList";
import "../Styles/Statistics.css";
import TableFormat from "../Components/TableFormat";
import DiagramFormat from "../Components/DiagramFormat";

const StatisticsPage = () => {
  const tasks = data;
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({
    positive: false,
    negative: false,
    fullyCompleted: false
  });
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [isTableFormat, setIsTableFormat] = useState(false);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxValues((prev) => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  const handleSwitchChange = (event) => {
    setIsTableFormat(event.target.checked);
  };

  console.log("Tasks:", tasks);
  console.log("Selected Tasks:", selectedTasks);
  console.log("Checkbox Values:", checkboxValues);
  console.log("Selected Radio:", selectedRadio);
  console.log("Table Format:", isTableFormat);

  return (
    <>
      <h1>My Statistics</h1>
      <div className="parameters">
        <Form>
          <Dropdown as={ButtonGroup}>
            <Button variant="success">Split Button</Button>

            <Dropdown.Toggle
              split
              variant="success"
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              <Form.Check
                inline
                label="Only positive"
                type="checkbox"
                id="positive"
                checked={checkboxValues.positive}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                label="Only negative"
                type="checkbox"
                id="negative"
                checked={checkboxValues.negative}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                label="Only fully completed"
                type="checkbox"
                id="fullyCompleted"
                checked={checkboxValues.fullyCompleted}
                onChange={handleCheckboxChange}
              />
            </Dropdown.Menu>
          </Dropdown>

          <div key="inline-radio" className="mb-3">
            <Form.Check
              inline
              label="1"
              name="group2"
              type="radio"
              id="inline-radio-1"
              value="1"
              checked={selectedRadio === "1"}
              onChange={handleRadioChange}
            />
            <Form.Check
              inline
              label="2"
              name="group2"
              type="radio"
              id="inline-radio-2"
              value="2"
              checked={selectedRadio === "2"}
              onChange={handleRadioChange}
            />
            <Form.Check
              inline
              label="3"
              name="group2"
              type="radio"
              id="inline-radio-3"
              value="3"
              checked={selectedRadio === "3"}
              onChange={handleRadioChange}
            />
          </div>

          <Form.Check
            type="switch"
            id="custom-switch"
            label="Table format"
            checked={isTableFormat}
            onChange={handleSwitchChange}
          />
        </Form>

        <div className="search-bar-container">
          <SearchBar setResults={setSelectedTasks} />
          {selectedTasks && selectedTasks.length > 0 && (
            <SearchResultsList results={selectedTasks} />
          )}
        </div>
      </div>
      <div className="content-container">
        {isTableFormat ? <TableFormat/> : <DiagramFormat/>}
      </div>
    </>
  );
};

export default StatisticsPage;
