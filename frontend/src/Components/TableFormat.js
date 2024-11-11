import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 70 },
  { field: 'totalTasks', headerName: 'Total tasks', width: 130 },
  { field: 'completedTasks', headerName: 'Completed Tasks', width: 130 },
  {
    field: 'attempts',
    headerName: 'Attempts',
    type: 'number',
    width: 90,
  },
  {
    field: 'errors',
    headerName: 'Errors',
    type: 'number',
    width: 90,
  },
  {
    field: 'successRate',
    headerName: 'Success rate',
    type: 'number',
    width: 90,
  },
  {
    field: 'timeSpent',
    headerName: 'Time pent',
    width: 160
  },
  {
    field: 'deadlines',
    headerName: 'deadlines',
    description: '',
    width: 160
  },
  {
    field: 'programmingLanguage',
    headerName: 'Programming language',
    width: 190
  },
  {
    field : 'code',
    headerName: 'Part of code',
    width: 400
  }

];



const paginationModel = { page: 0, pageSize: 5 };

export default function TableFormat({dataArray}) {
   const rows = dataArray;
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}