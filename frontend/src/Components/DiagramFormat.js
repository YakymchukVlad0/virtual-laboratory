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
  ResponsiveContainer
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const StatisticsDiagram = ({dataArray}) => {
  const taskData = dataArray;
  const successRateData = taskData.map(task => ({
    name: task.name,
    successRate: task.successRate,
  }));

  const attemptsData = taskData.map(task => ({
    name: task.name,
    attempts: task.attempts,
  }));

  const languageCountData = Object.values(
    taskData.reduce((acc, task) => {
      acc[task.programmingLanguage] = acc[task.programmingLanguage] || { language: task.programmingLanguage, count: 0 };
      acc[task.programmingLanguage].count += 1;
      return acc;
    }, {})
  );

  return (
    <div>
      <h2>Statistics Diagrams</h2>
      <h3>Success Rate per Task</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={successRateData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="successRate" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
      <h3>Attempts per Task</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={attemptsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="attempts" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Programming Language Usage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={languageCountData}
            dataKey="count"
            nameKey="language"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884D8"
            label
          >
            {languageCountData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <h3>Task Success Rate Comparison</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart outerRadius={150} data={successRateData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar name="Success Rate" dataKey="successRate" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsDiagram;
