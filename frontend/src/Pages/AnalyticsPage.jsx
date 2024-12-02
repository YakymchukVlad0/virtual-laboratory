import { useState, useEffect } from "react";
import EventsNavigation from "../Components/EventsNavigation";
import "../Styles/Analytics.css"
import newTasks from "../FakeData/tasks_data";
import {Button,Form} from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

const AnalyticsPage = () => {
  const [tasks, setTasks] = useState(newTasks);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({
    beginner: false,
    intermediate: false,
    advanced: false,
    on_time : false,
    missed : false
  });
  const [selectedRadio, setSelectedRadio] = useState(null);
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxValues((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const filterTasks = () => {
    let filteredTasks = newTasks;


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
    console.log(filteredTasks);
    setTasks(filteredTasks);
  };

 
  useEffect(() => {
    filterTasks();
  }, [checkboxValues]);

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
    
      return ( <>
        <EventsNavigation/>
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
                  type="on_time"
                  id="advanced"
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
        </Form>
      </div>

        <div className="task-analytics">
          
        </div>
        </>
      );
}
 
export default AnalyticsPage;