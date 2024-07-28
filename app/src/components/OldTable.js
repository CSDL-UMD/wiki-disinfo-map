import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const format_if_array = (val) => {
  if (Array.isArray(val)) {
    let formatted = '';
    val.forEach((elem) => {
      formatted += `${elem}, `;
    });
    formatted = formatted.substring(0, formatted.length - 1);
    formatted = formatted.slice(0, -1);
    return formatted;
  } else {
    return val;
  }
};

const Table = (props) => {
  const [currData, setCurrData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [finalClickInfo, setFinalClickInfo] = useState({
    colDef: { headerName: '' },
    value: '',
    formattedValue: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOnCellClick = (params) => {
    if (params.formattedValue.length !== 0) {
      setFinalClickInfo(params);
      handleOpen();
    }
  };

  const handleOnCellEnter = (params) => {
    //TODO
  };

  // COLUMNS: Project Name, Description, Languages, Country, Region, Starting Year, Group
  const columns = [
    { field: 'id1', headerName: 'Project Name', flex: 0.2 },
    { field: 'id2', headerName: 'Description', flex: 0.6 },
    { field: 'id3', headerName: 'Language(s)', flex: 0.2 },
    { field: 'id4', headerName: 'Country/Countries', flex: 0.2 },
    { field: 'id5', headerName: 'Region', flex: 0.2 },
    { field: 'id6', headerName: 'Start Year', flex: 0.2 },
    { field: 'id7', headerName: 'Group Association', flex: 0.2 },
  ];

  const transformData = (data) => {
    const newData = [];

    // NOTE: for the purposes of the table component, the rows have to be associated with an ID
    for (let rowNum = 0; rowNum < data.length; rowNum++) {
      const translations = {
        'Project Name': 'id1',
        Description: 'id2',
        Languages: 'id3',
        Countries: 'id4',
        Region: 'id5',
        'Start Year': 'id6',
        'Group Association': 'id7',
      };
      const newRow = { id: `id${rowNum}` };
      for (const key in translations) {
        // get the translations (ex. id6)
        let id = translations[key];

        // assign the row value for the key that is associated with that ID to a new key
        newRow[id] = data[rowNum][key];
      }
      newData.push(newRow);
    }

    return newData;
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    setCurrData(transformData(props.data));
  }, [props.data]);

  return (
    <Paper>
      <DataGrid
        componentsProps={{
          cell: { onMouseOver: handleOnCellEnter },
        }}
        rows={currData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        disableColumnFilter
        onCellClick={handleOnCellClick}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="column-name"
        aria-describedby="cell-content"
      >
        <Box sx={style}>
          <Typography id="column-name" variant="h6" component="h2">
            {finalClickInfo.colDef.headerName}
          </Typography>
          <Typography id="cell-content" sx={{ mt: 2 }}>
            {format_if_array(finalClickInfo.formattedValue)}
          </Typography>
        </Box>
      </Modal>
    </Paper>
  );
};
export default Table;
