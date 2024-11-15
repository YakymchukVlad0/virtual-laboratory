import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import '../Styles/TableFormat.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 70 },
  { field: 'totalTasks', headerName: 'Total tasks', width: 130 },
  { field: 'completedTasks', headerName: 'Completed Tasks', width: 130 },
  { field: 'attempts', headerName: 'Attempts', type: 'number', width: 90 },
  { field: 'errors', headerName: 'Errors', type: 'number', width: 90 },
  { field: 'successRate', headerName: 'Success rate', type: 'number', width: 90 },
  { field: 'timeSpent', headerName: 'Time Spent', width: 160 },
  { field: 'deadlines', headerName: 'Deadlines', width: 160 },
  { field: 'programmingLanguage', headerName: 'Programming language', width: 190 },
  { field: 'code', headerName: 'Part of code', width: 400 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function TableFormat({ dataArray }) {
  const rows = dataArray;
  return (
    <Paper className="dark-theme-table" sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,
          color: "#dddddd", // General text color
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#333333",
            color: "#ffcc00",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-cell": {
            color: "#dddddd",
            borderBottom: "1px solid #444",
          },
          "& .MuiCheckbox-root": {
            color: "#ffcc00",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#2a2a2a",
            color: "#ffcc00",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#1a1a1a",
          },
        }}
      />
    </Paper>
  );
}
