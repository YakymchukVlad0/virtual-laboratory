import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

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

const ensureUniqueIds = (rows, prefix = "row") =>
  rows.map((row, index) => ({
    ...row,
    id: row.id ?? `${prefix}-${index}`, // Use existing ID or generate one
  }));

export default function UnifiedTables({ dataArray }) {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const successRateRows = ensureUniqueIds(
    dataArray.map((task, index) => ({
      Task: `Task ${index + 1}`,
      SuccessRate: ((task.TasksCompleted / (task.TasksCompleted + task.Errors)) * 100).toFixed(2) + "%",
      FailureRate: ((task.Errors / (task.TasksCompleted + task.Errors)) * 100).toFixed(2) + "%",
    })),
    "success"
  );

  const attemptsRows = ensureUniqueIds(
    dataArray.map((task, index) => ({
      Task: `Task ${index + 1}`,
      Attempts: task.Attempts,
    })),
    "attempts"
  );

  const errorsRows = ensureUniqueIds(
    dataArray.map((task, index) => ({
      Task: `Task ${index + 1}`,
      Errors: task.Errors,
    })),
    "errors"
  );

  const languageDistributionRows = ensureUniqueIds(
    Object.values(
      dataArray.reduce((acc, task) => {
        acc[task.ProgrammingLanguage] = acc[task.ProgrammingLanguage] || { id: task.ProgrammingLanguage, Count: 0 };
        acc[task.ProgrammingLanguage].Count += 1;
        return acc;
      }, {})
    ),
    "lang"
  );

  const timeSpentRows = ensureUniqueIds(
    dataArray.map((task, index) => ({
      Task: `Task ${index + 1}`,
      TimeSpent: task.TimeSpent,
    })),
    "time"
  );

  const deadlineStatusRows = ensureUniqueIds(
    Object.values(
      dataArray.reduce((acc, task) => {
        acc[task.DeadlineStatus] = acc[task.DeadlineStatus] || { id: task.DeadlineStatus, Count: 0 };
        acc[task.DeadlineStatus].Count += 1;
        return acc;
      }, {})
    ),
    "deadline"
  );

  const skillLevelRows = ensureUniqueIds(
    Object.values(
      dataArray.reduce((acc, task) => {
        acc[task.SkillLevel] = acc[task.SkillLevel] || { id: task.SkillLevel, Count: 0 };
        acc[task.SkillLevel].Count += 1;
        return acc;
      }, {})
    ),
    "skill"
  );

  const avgTimeCategoryRows = ensureUniqueIds(
    Object.values(
      dataArray.reduce((acc, task) => {
        acc[task.TaskCategory] = acc[task.TaskCategory] || { id: task.TaskCategory, TotalTime: 0, Count: 0 };
        acc[task.TaskCategory].TotalTime += parseFloat(task.TimeSpent);
        acc[task.TaskCategory].Count += 1;
        return acc;
      }, {})
    ).map(entry => ({
      id: entry.id,
      TaskCategory: entry.id,
      AvgTimeSpent: (entry.TotalTime / entry.Count).toFixed(2),
    })),
    "avgTime"
  );

  const errorRateSkillRows = ensureUniqueIds(
    Object.values(
      dataArray.reduce((acc, task) => {
        acc[task.SkillLevel] = acc[task.SkillLevel] || { id: task.SkillLevel, TotalErrors: 0, TaskCount: 0 };
        acc[task.SkillLevel].TotalErrors += task.Errors;
        acc[task.SkillLevel].TaskCount += 1;
        return acc;
      }, {})
    ).map(entry => ({
      id: entry.id,
      SkillLevel: entry.id,
      AvgErrorRate: (entry.TotalErrors / entry.TaskCount).toFixed(2),
    })),
    "errorRateSkill"
  );

  const completionTimeLanguageRows = ensureUniqueIds(
    Object.values(
      dataArray.reduce((acc, task) => {
        acc[task.ProgrammingLanguage] = acc[task.ProgrammingLanguage] || { id: task.ProgrammingLanguage, TotalTime: 0, Count: 0 };
        acc[task.ProgrammingLanguage].TotalTime += parseFloat(task.TimeSpent);
        acc[task.ProgrammingLanguage].Count += 1;
        return acc;
      }, {})
    ).map(entry => ({
      id: entry.id,
      Language: entry.id,
      AvgCompletionTime: (entry.TotalTime / entry.Count).toFixed(2),
    })),
    "completionTimeLang"
  );

  const tables = [
    {
      label: "Success Rate",
      rows: successRateRows,
      columns: [
        { field: "Task", headerName: "Task" },
        { field: "SuccessRate", headerName: "Success Rate", flex: 1 },
        { field: "FailureRate", headerName: "Failure Rate", flex: 1 },
      ],
    },
    {
      label: "Attempts",
      rows: attemptsRows,
      columns: [
        { field: "Task", headerName: "Task" },
        { field: "Attempts", headerName: "Attempts", flex: 1 },
      ],
    },
    {
      label: "Errors",
      rows: errorsRows,
      columns: [
        { field: "Task", headerName: "Task" },
        { field: "Errors", headerName: "Errors", flex: 1 },
      ],
    },
    {
      label: "Language Distribution",
      rows: languageDistributionRows,
      columns: [
        { field: "id", headerName: "Programming Language" },
        { field: "Count", headerName: "Count", flex: 1 },
      ],
    },
    {
      label: "Time Spent",
      rows: timeSpentRows,
      columns: [
        { field: "Task", headerName: "Task" },
        { field: "TimeSpent", headerName: "Time Spent", flex: 1 },
      ],
    },
    {
      label: "Deadline Status",
      rows: deadlineStatusRows,
      columns: [
        { field: "id", headerName: "Deadline Status" },
        { field: "Count", headerName: "Count", flex: 1 },
      ],
    },
    {
      label: "Skill Level",
      rows: skillLevelRows,
      columns: [
        { field: "id", headerName: "Skill Level" },
        { field: "Count", headerName: "Count", flex: 1 },
      ],
    },
    {
      label: "Avg Time by Task Category",
      rows: avgTimeCategoryRows,
      columns: [
        { field: "TaskCategory", headerName: "Task Category" },
        { field: "AvgTimeSpent", headerName: "Avg Time Spent", flex: 1 },
      ],
    },
    {
      label: "Error Rate by Skill Level",
      rows: errorRateSkillRows,
      columns: [
        { field: "SkillLevel", headerName: "Skill Level" },
        { field: "AvgErrorRate", headerName: "Avg Error Rate", flex: 1 },
      ],
    },
    {
      label: "Avg Completion Time by Language",
      rows: completionTimeLanguageRows,
      columns: [
        { field: "Language", headerName: "Programming Language" },
        { field: "AvgCompletionTime", headerName: "Avg Completion Time", flex: 1 },
      ],
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
            <Paper sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={table.rows}
                columns={table.columns}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
