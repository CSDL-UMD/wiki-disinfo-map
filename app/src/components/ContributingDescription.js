import React from 'react';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

const textStyle = {
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};

const ContributingDescription = () => {
  return (
    <Paper style={{ padding: 10, margin: '10px 0' }}>
      <Typography
        variant="h4"
        style={{
          ...textStyle,
          fontWeight: 'bold',
        }}
      >
        How to Contribute?
      </Typography>
      <p style={textStyle}>
        The dataset is growing based on community submissions. If you'd like to
        include a project in this website, please submit through the form linked
        in the navigation bar above. Submissions will be reviewed on an
        individual basis before being approved.
      </p>
    </Paper>
  );
};

export default ContributingDescription;
