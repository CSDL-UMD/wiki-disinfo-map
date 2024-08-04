import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
  getMRT_RowSelectionHandler
} from 'material-react-table';

const Table2 = (props) => {
  const [currData, setCurrData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const headerColumns = useMemo(
    () => [
      { accessorKey: 'Project Name', header: 'Project Name' },
      { accessorKey: 'Languages', header: 'Language(s)' },
      { accessorKey: 'Countries', header: 'Country/Countries' },
      { accessorKey: 'Region', header: 'Region' },
      { accessorKey: 'Start Year', header: 'Start Year' },
      { accessorKey: 'Group Association', header: 'Group Association' },
    ],
    []
  );
  const detailPanelCol = { accessorKey: 'Description', header: 'Description' };

  const formatDataEntry = (entry) => {
    let formatted = entry;
    formatted = Array.isArray(formatted) ? formatted.join(', ') : formatted;
    formatted =
      typeof formatted === 'string' || formatted instanceof String
        ? formatted.trim()
        : formatted;
    return formatted;
  };

  const preprocessData = (data) => {
    const columns = headerColumns.map((r) => r.accessorKey);
    columns.push(detailPanelCol.accessorKey);

    for (const row of data) {
      for (const col of columns) {
        row[col] = formatDataEntry(row[col]);
      }
    }
    return data;
  };

  useEffect(() => {
    // Update the document title using the browser API
    setCurrData(preprocessData(props.data));
  }, [props.data]);

  const table = useMaterialReactTable({
    data: currData,
    columns: headerColumns,
    muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
      onClick: (event) =>{
        getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event); //import this helper function from material-react-table
        table.setExpanded((prevExpanded) => ({
          ...prevExpanded,
          [row.id]: !prevExpanded[row.id],
        })); // combines what was previously expanded to expanding/not expanding current row
      },
      sx: { cursor: 'pointer' },
    }),
    state: {
      expanded
    },
    onExpandedChange: setExpanded,
    renderDetailPanel: ({ row }) => {
      return (
        <Box
          sx={{
            display: 'grid',
            width: 'calc(100vw - 150px)',
          }}
        >
          <Typography>
            Description: {row.original[detailPanelCol.accessorKey]}
          </Typography>
          {/* <Typography>{detailPanelCol.accessorKey}</Typography> */}
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};
export default Table2;
