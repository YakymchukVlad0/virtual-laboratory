import EventsNavigation from "../Components/EventsNavigation";
import "../Styles/Analytics.css"
import React, { useState, useEffect } from "react";
import axios from 'axios';

import { useAuth } from '../Contexts/AuthContext';

const AnalyticsPage = () => {
  const { auth } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!auth || !auth.username) return; // Ensure auth and username are available

    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8000/analytics/reports', {
          params: { username: auth.username } // Send username to the server
        });
        console.log(response.data); // Log the server response
        setReports(response.data.reports); // Save the response data
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [auth]);

  const downloadReport = async (report) => {
    try {
      const response = await axios.post('http://localhost:8000/analytics/download', {
        username: auth.username, // Send the username
        report: report, // Send the task report object
      }, {
        responseType: 'blob', // Indicate that we expect a PDF file (blob data)
      });

      // Create a Blob from the response and generate a URL
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.task_number}_report.pdf`; // Set the filename for download
      link.click(); // Trigger the download
      URL.revokeObjectURL(url); // Clean up the Blob URL after download

    } catch (error) {
      console.error('Error downloading the report:', error);
    }
  };

  return (
    <>
      <EventsNavigation />
      <div className="task-analytics">
        <h2>Task Analytics</h2>
        <div className="task-list">
          {reports.map((report, index) => (
            <div key={index} className="task-card">
              <h3>{report.task_number} - {report.language}</h3>
              <p><strong>Course:</strong> {report.course}</p>
              <p><strong>Language:</strong> {report.language}</p>
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
              <button onClick={() => downloadReport(report)} className="download-btn">Download</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AnalyticsPage;
