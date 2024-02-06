import React from 'react';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

const DevelopmentDescription = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <Typography
        variant="h4"
        component="h2"
        style={{
          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
          fontWeight: 'bold',
        }}
      >
        Development Process
      </Typography>
      <p
        style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
      >
        The Wikimedia Disinformation Map is a community effort created by researchers at the University of Maryland in the
        Computational Sociodynamics Lab. This website was created as a visualization tool to help spread awareness and
        bring about community involvement in the projects. With the help of contacts at Wikimedia, researchers developed
        an initial dataset of anti-disinformation efforts.
        <br></br><br></br>The dataset is growing based on community submissions. If you'd like to include a project in this
        website, contact: FILL IN LATER
      </p>
    </Paper>
  );
};

export default DevelopmentDescription;
