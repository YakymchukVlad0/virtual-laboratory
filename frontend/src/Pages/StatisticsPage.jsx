
import {Button,Form} from "react-bootstrap";
import { taskData as data } from "../FakeData/Data";
import { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { SearchBar } from "../Components/SearchBar.jsx";
import { SearchResultsList } from "../Components/SearchResultList.jsx";
import "../Styles/Statistics.css";
import TableFormat from "../Components/TableFormat.jsx";
import DiagramFormat from "../Components/DiagramFormat.jsx";

const StatisticsPage = () => {
  const [tasks, setTasks] = useState(data);
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
    setTasks(data);
    console.log(checkboxValues);
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
    console.log(selectedRadio);
  };

  const handleSwitchChange = (event) => {
    setIsTableFormat(event.target.checked);
  };

  return (
    <>
      <h1>My Statistics</h1>
      <div className="parameters">
        <Form>
          {/* Dropdown and filter options grouped together */}
          <div className="filter-container">
            <Dropdown as={ButtonGroup} className="dropdown-container">
              <Button variant="success">Filter Options</Button>
              <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

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

            <div key="inline-radio" className="radio-options">
              <Form.Check
                inline
                label="Sort option1"
                name="group2"
                type="radio"
                id="inline-radio-1"
                value="1"
                checked={selectedRadio === "1"}
                onChange={handleRadioChange}
              />
              <Form.Check
                inline
                label="Sort option2"
                name="group2"
                type="radio"
                id="inline-radio-2"
                value="2"
                checked={selectedRadio === "2"}
                onChange={handleRadioChange}
              />
              <Form.Check
                inline
                label="Sort option3"
                name="group2"
                type="radio"
                id="inline-radio-3"
                value="3"
                checked={selectedRadio === "3"}
                onChange={handleRadioChange}
              />
            </div>
          </div>

          <Form.Check
            className="formatSwitch"
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
        {isTableFormat ? <TableFormat dataArray={tasks}/> : <DiagramFormat dataArray={tasks}/>}
      </div>
    </>
  );
};

export default StatisticsPage;
