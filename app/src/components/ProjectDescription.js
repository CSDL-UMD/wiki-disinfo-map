import React from 'react';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

const textStyle = {
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};

const ProjectDescription = () => {
  return (
    <Paper style={{ padding: 10, margin: '10px 0' }}>
      <Typography
        variant="h4"
        style={{
          ...textStyle,
          fontWeight: 'bold',
        }}
      >
        Background
      </Typography>
      <p style={textStyle}>
        Wikipedia is a trusted source of accurate and reliable knowledge for
        millions of people worldwide. Edited by thousands of volunteers across
        more than 300 language versions, the encyclopedia is part of a global
        mission to build a reliable and open knowledge infrastructure for the
        internet.
      </p>
      <p style={textStyle}>
        Due to its prominence and importance online, however, Wikipedia and the
        other Wikimedia projects are constantly under threat from external
        actors, whose aim is to compromise its independence and undermine its
        integrity as a free and open source of knowledge. Authoritarian regimes
        have persecuted local Wikipedia editors for their role in documenting
        conflicts like the war in Ukraine, and shady marketing firms create fake
        grassroots campaigns to promote companies and influence state and local
        decision-making processes.
      </p>
      <p style={textStyle}>
        The Wikimedia volunteer community, however, is fighting back. Over the
        years, a number of community-led projects have worked hard to counter
        these threats. The goal of this project is to compile the first
        exhaustive map of these community efforts, aimed at preserving the
        integrity of the Wikimedia projects, and to provide resources for those
        within the community who are engaged in the active and ongoing process
        of countering disinformation and advancing information literacy across
        the world.
      </p>
    </Paper>
  );
};

export default ProjectDescription;
