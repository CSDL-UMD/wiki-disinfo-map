import React from 'react';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
const data  = require('./data.json')

const Table = () => {
  // COLUMNS: Project Name, Description, Languages, Country, Region, Starting Year, Group
  const columns = [
    { field: 'id1', headerName: 'Project Name', flex : 0.2 },
    { field: 'id2', headerName: 'Description', flex: 0.2},
    { field: 'id3', headerName: 'Languages', flex: 0.2},
    { field: 'id4', headerName: 'Country', flex: 0.2},
    { field: 'id5', headerName: 'Region', flex: 0.2},
    { field: 'id6', headerName: 'Starting Year', flex: 0.2},
    { field: 'id7', headerName: 'Group', flex: 0.2},
  ]

  console.log(data)

  return (
    <Paper>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      <p>ProjectDescription</p>
    </Paper>
  );
};
export default Table;
