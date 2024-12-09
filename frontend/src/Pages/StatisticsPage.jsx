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
    top: "23%",
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
      const tempTasks = response.data.tasks;
      for(let i =0;i<tempTasks.length;i++){
        if(!tempTasks[i].ProgrammingLanguage){
          
          tempTasks[i].ProgrammingLanguage = 'N/A';
        }

        if(!tempTasks[i].TaskCategory){
          
          tempTasks[i].TaskCategory = 'N/A';
        }
        if(!tempTasks[i].DeadlineStatus){
          
          tempTasks[i].DeadlineStatus= 'missed deadline';
        }
        if(!tempTasks[i].SkillLevel){
          
          tempTasks[i].SkillLevel = 'N/A';
        }
      }
      
      setAllTasks(tempTasks);
      setTasks(tempTasks); // Initialize tasks with all tasks
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
    setSelectedRadio(event.target.value);
    console.log(selectedRadio);
    if(event.target.value === 'language'){
      tasks.sort(sortLanguage);
    }else if(event.target.value === 'deadline_status'){
      tasks.sort(sortDeadline);
    }else if(event.target.value === 'level'){
      sortLevel();
    }
    console.log(tasks);
  };

  const sortLanguage = (a,b)=>{
    if(a.ProgrammingLanguage < b.ProgrammingLanguage){
      return -1;
    }else if (a.ProgrammingLanguage === b.ProgrammingLanguage) {
      return 0;
    } else {
      return 1;
    }
    
  }

  const sortDeadline = (a,b)=>{
    if(a.DeadlineStatus < b.DeadlineStatus){
      return -1;
    }else if (a.DeadlineStatus === b.DeadlineStatus) {
      return 0;
    } else {
      return 1;
    }
    
  }

  const sortLevel = ()=>{
    let sorted = [];
    for(let i = 0; i<tasks.length; i++){
        if(tasks[i].SkillLevel === 'beginner'){
          sorted.push(tasks[i]);
        }
    }
    for(let i = 0; i<tasks.length; i++){
      if(tasks[i].SkillLevel === 'intermediate'){
        sorted.push(tasks[i]);
      }
    }

    for(let i = 0; i<tasks.length; i++){
      if(tasks[i].SkillLevel === 'advanced'){
       sorted.push(tasks[i]);
      }
    }
    console.log(sorted);
    setTasks(sorted);
  }

  const handleSwitchChange = (event) => {
    setIsTableFormat(event.target.checked);
  };

  return (
    <>
      <EventsNavigation />
      <h1>My Statistics</h1>
      <div className={styles.parameters}>
        <div className="filter-container" style={{}}>
          <Dropdown as={ButtonGroup} style={{dropdownStyle, top: 'auto', marginLeft: '47%', width: '400px', marginTop: '4px'}}>
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

      <div className="content-container" style={{maxWidth: '80%', marginLeft: '10%'}}>
        {isTableFormat ? <TableFormat dataArray={tasks} /> : <DiagramFormat dataArray={tasks} />}
      </div>
    </>
  );
};

export default StatisticsPage;
