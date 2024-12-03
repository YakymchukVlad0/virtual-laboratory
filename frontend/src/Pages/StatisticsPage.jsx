import { Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { SearchBar } from "../Components/SearchBar.jsx";
import { SearchResultsList } from "../Components/SearchResultList.jsx";
import "../Styles/Statistics.css";
import TableFormat from "../Components/TableFormat.jsx";
import DiagramFormat from "../Components/DiagramFormat.jsx";
import EventsNavigation from "../Components/EventsNavigation.jsx";
import axios from "axios";
import styles from "../Styles/Statistics.module.css";

const StatisticsPage = () => {
  const [allTasks, setAllTasks] = useState([]); // Store original tasks
  const [tasks, setTasks] = useState([]); // Store filtered tasks
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({
    beginner: false,
    intermediate: false,
    advanced: false,
    on_time: false,
    missed: false,
  });
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [isTableFormat, setIsTableFormat] = useState(false);
  const [username, setUsername] = useState("");
  const [myToken, setToken] = useState("");

  const dropdownStyle = {
    position: "absolute",
    zIndex: 1,
    width: "400px",
    top: "22%",
    left: "unset",
    marginTop: "0px",
    height: "0px",
  };

  const fetchTaskStats = async () => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    if (!userString) {
      alert("Please log in again.");
      return;
    }

    const user = JSON.parse(userString);
    const userId = user.id;

    setUsername(user.username);
    setToken(token);

    if (!userId) {
      alert("Please log in again.");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/tasks/student/${user.username}/course/Developing`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllTasks(response.data.tasks);
      setTasks(response.data.tasks); // Initialize tasks with all tasks
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      alert(
        "There was an error fetching your activity stats. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchTaskStats();
  }, []);

  const filterTasks = () => {
    let filteredTasks = [...allTasks];

    if (checkboxValues.beginner || checkboxValues.intermediate || checkboxValues.advanced) {
      filteredTasks = filteredTasks.filter((task) =>
        (checkboxValues.beginner && task.SkillLevel === "beginner") ||
        (checkboxValues.intermediate && task.SkillLevel === "intermediate") ||
        (checkboxValues.advanced && task.SkillLevel === "advanced")
      );
    }

    if (checkboxValues.on_time || checkboxValues.missed) {
      filteredTasks = filteredTasks.filter((task) =>
        (checkboxValues.on_time && task.DeadlineStatus === "on time") ||
        (checkboxValues.missed && task.DeadlineStatus === "missed deadline")
      );
    }

    setTasks(filteredTasks);
  };

  useEffect(() => {
    filterTasks();
  }, [checkboxValues]);

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxValues((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedRadio(value);

    let sortedTasks = [...tasks];
    if (value === "language") {
      sortedTasks.sort((a, b) => a.ProgrammingLanguage.localeCompare(b.ProgrammingLanguage));
    } else if (value === "deadline_status") {
      sortedTasks.sort((a, b) => a.DeadlineStatus.localeCompare(b.DeadlineStatus));
    } else if (value === "level") {
      sortedTasks = sortedTasks.sort((a, b) => {
        const levels = { beginner: 1, intermediate: 2, advanced: 3 };
        return levels[a.SkillLevel] - levels[b.SkillLevel];
      });
    }
    setTasks(sortedTasks);
  };

  const handleSwitchChange = (event) => {
    setIsTableFormat(event.target.checked);
  };

  return (
    <>
      <EventsNavigation />
      <h1>My Statistics</h1>
      <div className={styles.parameters}>
        <div className="filter-container">
          <Dropdown as={ButtonGroup} style={dropdownStyle}>
            <Button variant="success">Filter Options</Button>
            <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

            <Dropdown.Menu>
              <Form.Check
                inline
                label="Beginner"
                type="checkbox"
                id="beginner"
                checked={checkboxValues.beginner}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                label="Intermediate"
                type="checkbox"
                id="intermediate"
                checked={checkboxValues.intermediate}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                label="Advanced"
                type="checkbox"
                id="advanced"
                checked={checkboxValues.advanced}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                label="On time"
                type="checkbox"
                id="on_time"
                checked={checkboxValues.on_time}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                inline
                label="Missed"
                type="checkbox"
                id="missed"
                checked={checkboxValues.missed}
                onChange={handleCheckboxChange}
              />
            </Dropdown.Menu>
          </Dropdown>

          <div key="inline-radio" className="radio-options">
            <Form.Check
              inline
              label="By Level"
              name="group2"
              type="radio"
              id="inline-radio-1"
              value="level"
              checked={selectedRadio === "level"}
              onChange={handleRadioChange}
            />
            <Form.Check
              inline
              label="Deadline status"
              name="group2"
              type="radio"
              id="inline-radio-2"
              value="deadline_status"
              checked={selectedRadio === "deadline_status"}
              onChange={handleRadioChange}
            />
            <Form.Check
              inline
              label="Programming language"
              name="group2"
              type="radio"
              id="inline-radio-3"
              value="language"
              checked={selectedRadio === "language"}
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
      </div>

      <div className="search-wrapper">
        <SearchBar setResults={setSelectedTasks} tasks={tasks} />
        {selectedTasks && selectedTasks.length > 0 && (
          <SearchResultsList results={selectedTasks} tasksData={allTasks} />
        )}
      </div>

      <div className="content-container">
        {isTableFormat ? <TableFormat dataArray={tasks} /> : <DiagramFormat dataArray={tasks} />}
      </div>
    </>
  );
};

export default StatisticsPage;
