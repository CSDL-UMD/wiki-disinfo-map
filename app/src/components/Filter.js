import React from 'react';
import { Paper } from '@mui/material';

const Filter = ({ column }) => {
  return (
    <Paper>
      <p>Filter by {column}</p>
    </Paper>
  );
};

export default Filter;
