import EventsNavigation from "../Components/EventsNavigation";
import { taskData } from "../FakeData/Data";
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
        setReports(response.data); // Save the response data
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [auth]);

    const generateAnalysis = (code, programmingLanguage) => {
        if (programmingLanguage === "JavaScript") {
          return [
            "The code defines a function to calculate the factorial of a number using recursion.",
            "It uses a base case when `n` is 0, returning 1. Otherwise, it multiplies `n` by the factorial of `n-1`.",
            "This approach is simple but might cause a stack overflow if `n` is too large due to recursion depth."
          ];
        } else if (programmingLanguage === "Python") {
          return [
            "This code loops through numbers 0 to 9 and prints each value.",
            "It's a basic loop structure, useful for understanding iteration in programming.",
            "This example also demonstrates the use of the `console.log` function to output data to the console."
          ];
        } else if (programmingLanguage === "Java") {
          return [
            "The code is a simple `main` method in Java that prints 'Hello' to the console.",
            "It demonstrates the basic structure of a Java program with the `main` method as the entry point.",
            "This program doesn't take input and just outputs a static string."
          ];
        } else {
          return [
            "The code is written in " + programmingLanguage + " and performs basic functionality.",
            "It demonstrates core syntax and structure of the language."
          ];
        }
      };
    
      return ( <>
        <EventsNavigation/>
        <div className="task-analytics">
          <h2>Task Analytics</h2>
          <div className="task-list">
            {taskData.map((task) => (
              <div key={task.id} className="task-card">
                <h3>{task.name} - {task.programmingLanguage}</h3>
                <pre>
                  <code>{task.code}</code>
                </pre>
                <div className="analysis">
                  <h4>"asdasd"</h4>
                  <ul>
                    {generateAnalysis(task.code, task.programmingLanguage).map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="task-stats">
                  <p><strong>Success Rate:</strong> {task.successRate}%</p>
                  <p><strong>Time Spent:</strong> {task.timeSpent}</p>
                  <p><strong>Errors:</strong> {task.errors}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
      );
}
 
export default AnalyticsPage;