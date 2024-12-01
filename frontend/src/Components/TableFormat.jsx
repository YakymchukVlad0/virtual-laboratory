import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const tabStyles = {
  "& .MuiTabs-flexContainer": {
    backgroundColor: "#333",
    color: "#ffcc00",
  },
  "& .MuiTab-root": {
    fontWeight: "bold",
    color: "#ffcc00",
  },
  "& .MuiTab-textColorPrimary.Mui-selected": {
    color: "#ffffff",
  },
};

export default function UnifiedTables({ dataArray }) {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  // Generate rows for each table
  const errorsBySkillRows = Object.values(
    dataArray.reduce((acc, task) => {
      acc[task.SkillLevel] = acc[task.SkillLevel] || { id: task.SkillLevel, SkillLevel: task.SkillLevel, totalErrors: 0, count: 0 };
      acc[task.SkillLevel].totalErrors += task.Errors;
      acc[task.SkillLevel].count += 1;
      return acc;
    }, {})
  ).map(entry => ({
    id: entry.SkillLevel,
    SkillLevel: entry.SkillLevel,
    AverageErrors: (entry.totalErrors / entry.count).toFixed(2),
  }));

  const completionRateRows = Object.values(
    dataArray.reduce((acc, task) => {
      acc[task.ProgrammingLanguage] = acc[task.ProgrammingLanguage] || { id: task.ProgrammingLanguage, total: 0, completed: 0 };
      acc[task.ProgrammingLanguage].total += 1; // Assuming each task is a single row
      acc[task.ProgrammingLanguage].completed += task.TasksCompleted;
      return acc;
    }, {})
  ).map(entry => ({
    id: entry.id,
    ProgrammingLanguage: entry.id,
    CompletionRate: ((entry.completed / entry.total) * 100).toFixed(2) + "%",
  }));

  const topErrorsRows = dataArray
    .sort((a, b) => b.Errors - a.Errors)
    .slice(0, 10)
    .map((task, index) => ({
      id: index + 1,
      SkillLevel: task.SkillLevel,
      Errors: task.Errors,
      TaskCategory: task.TaskCategory,
    }));

  const avgTimeByCategoryRows = Object.values(
    dataArray.reduce((acc, task) => {
      acc[task.TaskCategory] = acc[task.TaskCategory] || { id: task.TaskCategory, totalTime: 0, count: 0 };
      acc[task.TaskCategory].totalTime += parseFloat(task.TimeSpent);
      acc[task.TaskCategory].count += 1;
      return acc;
    }, {})
  ).map(entry => ({
    id: entry.id,
    TaskCategory: entry.id,
    AvgTimeSpent: (entry.totalTime / entry.count).toFixed(2),
  }));

  const missedDeadlineRows = dataArray
    .filter(task => task.DeadlineStatus !== "on time")
    .map((task, index) => ({
      id: index + 1,
      TaskCategory: task.TaskCategory,
      Deadline: task.Deadline,
      TimeSpent: task.TimeSpent,
    }));

  // Column configurations for each table
  const errorsBySkillColumns = [
    { field: 'SkillLevel', headerName: 'Skill Level', width: 200 },
    { field: 'AverageErrors', headerName: 'Average Errors', width: 200 },
  ];

  const completionRateColumns = [
    { field: 'ProgrammingLanguage', headerName: 'Programming Language', width: 200 },
    { field: 'CompletionRate', headerName: 'Completion Rate (%)', width: 200 },
  ];

  const topErrorsColumns = [
    { field: 'SkillLevel', headerName: 'Skill Level', width: 200 },
    { field: 'Errors', headerName: 'Errors', type: 'number', width: 200 },
    { field: 'TaskCategory', headerName: 'Task Category', width: 200 },
  ];

  const avgTimeByCategoryColumns = [
    { field: 'TaskCategory', headerName: 'Task Category', width: 200 },
    { field: 'AvgTimeSpent', headerName: 'Average Time Spent', width: 200 },
  ];

  const missedDeadlineColumns = [
    { field: 'TaskCategory', headerName: 'Task Category', width: 200 },
    { field: 'Deadline', headerName: 'Deadline', width: 200 },
    { field: 'TimeSpent', headerName: 'Time Spent', width: 200 },
  ];

  const tables = [
    {
      label: "Errors by Skill Level",
      rows: errorsBySkillRows,
      columns: errorsBySkillColumns,
    },
    {
      label: "Completion Rate by Language",
      rows: completionRateRows,
      columns: completionRateColumns,
    },
    {
      label: "Top Errors by Users",
      rows: topErrorsRows,
      columns: topErrorsColumns,
    },
    {
      label: "Average Time by Task Category",
      rows: avgTimeByCategoryRows,
      columns: avgTimeByCategoryColumns,
    },
    {
      label: "Missed Deadlines",
      rows: missedDeadlineRows,
      columns: missedDeadlineColumns,
    },
  ];

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleChange} sx={tabStyles}>
        {tables.map((table, index) => (
          <Tab key={index} label={table.label} />
        ))}
      </Tabs>
      <Box sx={{ padding: 2 }}>
        {tables.map((table, index) => (
          <Box key={index} hidden={activeTab !== index}>
            <Paper className="dark-theme-table" sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={table.rows}
                columns={table.columns}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{
                  border: 0,
                  color: "#dddddd",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#333333",
                    color: "#ffcc00",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-cell": {
                    color: "#dddddd",
                  },
                }}
              />
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
