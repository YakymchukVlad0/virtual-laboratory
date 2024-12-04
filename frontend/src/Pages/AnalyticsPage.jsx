import EventsNavigation from "../Components/EventsNavigation";
import "../Styles/Analytics.css";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { useAuth } from '../Contexts/AuthContext';

const AnalyticsPage = () => {
  const { auth } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
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
