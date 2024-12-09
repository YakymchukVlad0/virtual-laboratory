import EventsNavigation from "../Components/EventsNavigation";
import "../Styles/Analytics.css";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Button, Form } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";

import { useAuth } from '../Contexts/AuthContext';

const AnalyticsPage = () => {
  const { auth } = useAuth();
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]); 
  const [tasks, setTasks] = useState([]); 
  const [checkboxValues, setCheckboxValues] = useState({
    beginner: false,
    intermediate: false,
    advanced: false,
    on_time: false,
    missed: false,
  });
  const [selectedRadio, setSelectedRadio] = useState(null);
  const dropdownStyle = {
    position: "absolute",
    zIndex: 1,
    width: "400px",
    top: "25%",
    left: "unset",
    marginTop: "0px",
    height: "0px",
    marginLeft:"0px",
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
      setTasks(tempTasks); 
    } catch (error) {
      console.error("Error fetching activity stats:", error);
      alert(
        "There was an error fetching your activity stats. Please try again later."
      );
    }
  };



  useEffect(() => {
    if (!auth || !auth.username) return; // Ensure auth and username are available

    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8000/analytics/reports', {
          params: { username: auth.username } // Send username to the server
        });
        console.log(response.data); // Log the server response
        setIsLoading(false);
        setReports(response.data.reports); // Save the response data
        setAllReports(response.data.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
    fetchTaskStats();
  }, [auth]);

  const downloadReportAsPDF = async (report) => {
    try {
      const response = await axios.post('http://localhost:8000/analytics/download', {
        username: auth.username, // Send the username
        report: report, // Send the task report object
      }, {
        responseType: 'blob', // Indicate that we expect a PDF file (blob data)
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.task_number}_report.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the report as PDF:', error);
    }
  };

  const downloadReportAsTXT = (report) => {
    const content = `Task Number: ${report.task_number}
Language: ${report.language}
Course: ${report.course}

General Comments:
${report.general_comment.map((comment) => `${comment}`).join('\n')}

Notes:
${report.notes.map((note) => `${note}`).join('\n')}

Statistics:
- Number of conditions: ${report.statistics["Number of conditions"]}
- Number of function duplications: ${report.statistics["Number of function duplications"]}
- Number of loops: ${report.statistics["Number of loops"]}
- Number of redundant operators: ${report.statistics["Number of redundant operators"]}

Evaluation:
The complexity of the code is evaluated in: ${report.evaluation}/20
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.task_number}_report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };



  const filterTasks = () => {
    if (!reports || !allTasks) return;
  
    let filteredTasks = [...allTasks];
    let filteredReports = [];
  
    // Filter tasks by skill level
    if (checkboxValues.beginner || checkboxValues.intermediate || checkboxValues.advanced) {
      filteredTasks = filteredTasks.filter((task) =>
        (checkboxValues.beginner && task.SkillLevel === "beginner") ||
        (checkboxValues.intermediate && task.SkillLevel === "intermediate") ||
        (checkboxValues.advanced && task.SkillLevel === "advanced")
      );
    }
  
    // Filter tasks by deadline status
    if (checkboxValues.on_time || checkboxValues.missed) {
      filteredTasks = filteredTasks.filter((task) =>
        (checkboxValues.on_time && task.DeadlineStatus === "on time") ||
        (checkboxValues.missed && task.DeadlineStatus === "missed deadline")
      );
    }
  
    // Map reports based on filtered tasks
    for (let i = 0; i < allReports.length; i++) {
      for (let j = 0; j < filteredTasks.length; j++) { // Corrected j++
        if (allReports[i].task_number === filteredTasks[j].TaskName) { // Ensure TaskName exists
          filteredReports.push(allReports[i]);
          break; // Exit inner loop when a match is found
        }
      }
    }
  
    // If no matches, show all reports
    if (filteredReports.length === 0) {
      filteredReports = [...allReports];
    }

    console.log("All Tasks:", allTasks);
    console.log("Filtered Tasks:", filteredTasks);
    console.log("All Reports:", allReports);

  
    setReports(filteredReports);
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
    let sortedReports = [];
    console.log(tasks);
    for(let i =0; i< tasks.length;i++){
      for(let j =0; j<reports.length;j++){
        if(reports[j].task_number === tasks[i].TaskName){
          
          sortedReports.push(reports[j]);
        }
      }
    }
    console.log(sortedReports);
    setReports(sortedReports);

    
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
    setTasks(sorted);
  }

  return (
    <>
      <EventsNavigation />
      <div className="task-analytics">
        <h2>Task Analytics</h2>
        {isLoading && 
        <div className="loading-circle" style={{display:'flex',alignContent:'center', alignItems:'center'}}>
          <Box sx={{ display: 'flex',alignContent:'center', alignItems:'center' }}>
          <CircularProgress size="3rem" />
          </Box>
          </div>
        }
        <div className="parameters">
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
        </div>
        <div className="task-list">
          {reports.map((report, index) => (
            <div key={index} className="task-card">
              <h3>{report.task_number} - {report.language}</h3>
              <div className="analysis">
                <h4>General Comments:</h4>
                <ul>
                  {report.general_comment.map((comment, idx) => (
                    <li key={idx}>{comment}</li>
                  ))}
                </ul>
                <h4>Notes:</h4>
                <ul>
                  {report.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
                <h4>Statistics:</h4>
                <ul>
                  <p>Number of conditions: {report.statistics["Number of conditions"]}</p>
                  <p>Number of function duplications: {report.statistics["Number of function duplications"]}</p>
                  <p>Number of loops: {report.statistics["Number of loops"]}</p>
                  <p>Number of redundant operators: {report.statistics["Number of redundant operators"]}</p>
                </ul>
                <h4>Evaluate:</h4>
                <p>The complexity of the code is evaluated in: <strong>{report.evaluation}/20 </strong></p>
              </div>
              <button onClick={() => downloadReportAsPDF(report)} className="download-btn">Download as PDF</button>
              <button onClick={() => downloadReportAsTXT(report)} className="download-btn">Download as TXT</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
