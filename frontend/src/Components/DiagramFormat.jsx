import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6361"];

const DiagramFormat = ({ dataArray }) => {
  const taskData = dataArray;
  // Success Rate Data
  const successRateData = taskData.map(task => ({
    name: `Task ${taskData.indexOf(task) + 1}`,
    successRate: ((task.TasksCompleted / (task.TasksCompleted + task.Errors)) * 100).toFixed(2),
    failureRate: ((task.Errors / (task.TasksCompleted + task.Errors)) * 100).toFixed(2),
  }));

  // Attempts Per Task
  const attemptsData = taskData.map((task, index) => ({
    name: `Task ${index + 1}`,
    attempts: task.Attempts,
  }));

  // Errors By Task
  const errorData = taskData.map((task, index) => ({
    name: `Task ${index + 1}`,
    errors: task.Errors,
  }));

  // Programming Language Distribution
  const languageDistribution = Object.values(
    taskData.reduce((acc, task) => {
      acc[task.ProgrammingLanguage] = acc[task.ProgrammingLanguage] || { language: task.ProgrammingLanguage, count: 0 };
      acc[task.ProgrammingLanguage].count += 1;
      return acc;
    }, {})
  );





  // Time Spent Per Task
  const timeSpentData = taskData.map((task, index) => ({
    name: `Task ${index + 1}`,
    timeSpent: parseFloat(task.TimeSpent),
  }));

  // Deadline Status Distribution
  const deadlineStatus = Object.values(
    taskData.reduce((acc, task) => {
      acc[task.DeadlineStatus] = acc[task.DeadlineStatus] || { status: task.DeadlineStatus, count: 0 };
      acc[task.DeadlineStatus].count += 1;
      return acc;
    }, {})
  );

  // Skill Level Distribution
  const skillLevelDistribution = Object.values(
    taskData.reduce((acc, task) => {
      acc[task.SkillLevel] = acc[task.SkillLevel] || { skill: task.SkillLevel, count: 0 };
      acc[task.SkillLevel].count += 1;
      return acc;
    }, {})
  );

  // Average Completion Time By Category
  const averageCompletionTime = taskData.map(task => ({
    category: task.TaskCategory,
    avgCompletionTime: parseFloat(task.AverageCompletionTime),
  }));

    // Error Rate vs. Skill Level Data
    const errorRateSkillData = Object.values(
      taskData.reduce((acc, task) => {
        acc[task.SkillLevel] = acc[task.SkillLevel] || { skill: task.SkillLevel, totalErrors: 0, taskCount: 0 };
        acc[task.SkillLevel].totalErrors += task.Errors;
        acc[task.SkillLevel].taskCount += 1;
        return acc;
      }, {})
    ).map(entry => ({
      skill: entry.skill,
      avgErrorRate: (entry.totalErrors / entry.taskCount).toFixed(2),
    }));
  
    // Tasks Completed by Programming Language Data
    const tasksByLanguage = Object.values(
      taskData.reduce((acc, task) => {
        acc[task.ProgrammingLanguage] = acc[task.ProgrammingLanguage] || { language: task.ProgrammingLanguage, completed: 0 };
        acc[task.ProgrammingLanguage].completed += task.TasksCompleted;
        return acc;
      }, {})
    );
  
    // Time Spent vs. Attempts Data
    const timeAttemptsData = taskData.map((task, index) => ({
      name: `Task ${index + 1}`,
      timeSpent: parseFloat(task.TimeSpent),
      attempts: task.Attempts,
    }));


      // Task Categories Distribution
  const categoryDistribution = Object.values(
    taskData.reduce((acc, task) => {
      acc[task.TaskCategory] = acc[task.TaskCategory] || { category: task.TaskCategory, count: 0 };
      acc[task.TaskCategory].count += 1;
      return acc;
    }, {})
  );

  // Completion Time vs. Programming Language
  const completionTimeLanguageData = Object.values(
    taskData.reduce((acc, task) => {
      acc[task.ProgrammingLanguage] = acc[task.ProgrammingLanguage] || {
        language: task.ProgrammingLanguage,
        totalCompletionTime: 0,
        taskCount: 0
      };
      acc[task.ProgrammingLanguage].totalCompletionTime += parseFloat(task.AverageCompletionTime);
      acc[task.ProgrammingLanguage].taskCount += 1;
      return acc;
    }, {})
  ).map(entry => ({
    language: entry.language,
    avgCompletionTime: (entry.totalCompletionTime / entry.taskCount).toFixed(2),
  }));

  // Tasks and Errors Comparison
  const tasksErrorsComparison = taskData.map((task, index) => ({
    name: `Task ${index + 1}`,
    completed: task.TasksCompleted,
    errors: task.Errors,
  }));

  // Completion Time Heatmap
  const heatmapData = taskData.map((task, index) => ({
    name: `Task ${index + 1}`,
    timeSpent: parseFloat(task.AverageCompletionTime),
  }));

  // Error Percentage by Deadline Status
  const errorByDeadlineStatus = Object.values(
    taskData.reduce((acc, task) => {
      acc[task.DeadlineStatus] = acc[task.DeadlineStatus] || { status: task.DeadlineStatus, totalErrors: 0, totalTasks: 0 };
      acc[task.DeadlineStatus].totalErrors += task.Errors;
      acc[task.DeadlineStatus].totalTasks += task.TasksCompleted + task.Errors;
      return acc;
    }, {})
  ).map(entry => ({
    status: entry.status,
    errorPercentage: ((entry.totalErrors / entry.totalTasks) * 100).toFixed(2),
  }));

  return (
    <div>
      <h2>Statistics Diagrams</h2>

      {/* Success Rate */}
      <h3>Success Rate</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={successRateData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="successRate" fill="#0088FE" />
          <Bar dataKey="failureRate" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>

      {/* Attempts Per Task */}
      <h3>Attempts Per Task</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={attemptsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="attempts" fill="#FFBB28" />
        </BarChart>
      </ResponsiveContainer>

      {/* Errors Per Task */}
      <h3>Errors Per Task</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={errorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="errors" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>

      {/* Programming Language Distribution */}
      <h3>Programming Language Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={languageDistribution}
            dataKey="count"
            nameKey="language"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884D8"
            label
          >
            {languageDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Time Spent Per Task */}
      <h3>Time Spent Per Task</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="name" type="category" />
          <YAxis dataKey="timeSpent" />
          <Tooltip />
          <Legend />
          <Scatter name="Time Spent" data={timeSpentData} fill="#0088FE" />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Deadline Status */}
      <h3>Deadline Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={deadlineStatus}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#00C49F"
            label
          >
            {deadlineStatus.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Skill Level Distribution */}
      <h3>Skill Level Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={skillLevelDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#FF6361" />
        </BarChart>
      </ResponsiveContainer>


       {/* Error Rate vs. Skill Level */}
       <h3>Error Rate vs. Skill Level</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={errorRateSkillData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgErrorRate" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>

      {/* Tasks Completed by Programming Language */}
      <h3>Tasks Completed by Programming Language</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={tasksByLanguage}
            dataKey="completed"
            nameKey="language"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#FF8042"
            label
          >
            {tasksByLanguage.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Time Spent vs. Attempts */}
      <h3>Time Spent vs. Attempts</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="attempts" name="Attempts" />
          <YAxis type="number" dataKey="timeSpent" name="Time Spent" />
          <Tooltip />
          <Legend />
          <Scatter name="Time vs. Attempts" data={timeAttemptsData} fill="#0088FE" />
        </ScatterChart>
      </ResponsiveContainer>

        {/* Task Categories Distribution */}
        <h3>Task Categories Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={categoryDistribution}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis angle={30} />
          <Radar name="Tasks" dataKey="count" fill="#0088FE" fillOpacity={0.6} />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>

      {/* Completion Time vs. Programming Language */}
      <h3>Completion Time vs. Programming Language</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={completionTimeLanguageData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="language" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avgCompletionTime" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>

      {/* Tasks and Errors Comparison */}
      <h3>Tasks and Errors Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={tasksErrorsComparison}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#00C49F" />
          <Line type="monotone" dataKey="errors" stroke="#FF8042" />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Completion Time Heatmap */}
      <h3>Completion Time Heatmap</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="category" dataKey="name" />
          <YAxis dataKey="timeSpent" />
          <Tooltip />
          <Legend />
          <Scatter name="Time Spent" data={heatmapData} fill="#8884D8" />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Error Percentage by Deadline Status */}
      <h3>Error Percentage by Deadline Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={errorByDeadlineStatus}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="errorPercentage" fill="#FFBB28" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiagramFormat;
