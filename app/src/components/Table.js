import React, { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

const Table2 = (props) => {
  const [currData, setCurrData] = useState([]);
  const columns = useMemo(
    () => [
      { accessorKey: 'Project Name', header: 'Project Name' },
      { accessorKey: 'Description', header: 'Description' },
      { accessorKey: 'Languages', header: 'Language(s)' },
      { accessorKey: 'Countries', header: 'Country/Countries' },
      { accessorKey: 'Region', header: 'Region' },
      { accessorKey: 'Start Year', header: 'Start Year' },
      { accessorKey: 'Group Association', header: 'Group Association' },
    ],
    []
  );

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
    for (const row of data) {
      for (const col of columns) {
        row[col.accessorKey] = formatDataEntry(row[col.accessorKey]);
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
    columns,
  });

  return <MaterialReactTable table={table} />;
};
export default Table2;
