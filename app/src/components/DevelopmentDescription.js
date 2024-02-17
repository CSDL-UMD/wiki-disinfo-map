import React from 'react';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

const textStyle = {
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};

const DevelopmentDescription = () => {
  return (
    <Paper style={{ padding: 10, margin: '10px 0' }}>
      <Typography
        variant="h4"
        style={{
          ...textStyle,
          fontWeight: 'bold',
        }}
      >
        Development Process
      </Typography>
      <p style={textStyle}>
        The Wikimedia Disinformation Map is a community effort created by
        researchers at the University of Maryland in the Computational
        Sociodynamics Lab. This website was created as a visualization tool to
        help spread awareness and bring about community involvement in the
        projects. With the help of contacts at the Wikimedia Foundation,
        researchers developed an initial dataset of anti-disinformation efforts.
      </p>
      <p style={textStyle}>
        Main Developers:{' '}
        <i>Amrit Magesh, Bryant Luu, Daniel Pitzele, Rishi K Pradeep</i>
        <br />
        Dataset collection and Lookerstudio Prototyping:{' '}
        <i>Marilyn Harbert, Alberto Olivieri</i>
        <br />
        Project Leads: <i>Giovanni Ciampaglia, Costanza Caniglia</i>
      </p>
    </Paper>
  );
};

export default DevelopmentDescription;
