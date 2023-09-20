import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const data = require('../data/data.json');

const Table = (props) => {
  const [curData, setCurData] = useState([]);
  
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

  const transformData = (data) => {
    const newData = [];
    
    // NOTE: for the purposes of the table component, the rows have to be associated with an ID
    for (let rowNum = 0; rowNum < data.length; rowNum++) {
      const row = data[rowNum];

      const translations = {
        'Project': 'id1',
        'Description': 'id2', 
        'Languages': 'id3',
        'Country': 'id4',
        'Region': 'id5',
        'Year': 'id6',
        'Group': 'id7',
      }
      const newRow = {id: `id${rowNum}`};
      for (const key in translations) {
          // get the translations (ex. id6)
          let id = translations[key];
          
          // assign the row value for the key that is associated with that ID to a new key
          newRow[id] = data[rowNum][key]
      }
      newData.push(newRow);
    }

    return newData;
  } 

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    setCurData(transformData(props.data))
  }, [props.data]);

  return (
    <Paper>
      <DataGrid
        rows={curData}
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
