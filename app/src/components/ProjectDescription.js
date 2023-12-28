import React from 'react';
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

const ProjectDescription = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <Typography variant="h4" component="h2">
        Background
      </Typography>
      <p>
        Wikipedia is a trusted source of knowledge for millions of people worldwide. 
        Edited by thousands of volunteers across more than 300 language editions, 
        the encyclopedia is part of a global movement whose goal is to build a reliable 
        and open knowledge infrastructure for the Internet. Due to its prominence and 
        importance within cyberspace, however, Wikipedia and its sister projects are 
        constantly under threat from external actors whose role is to compromise its 
        independence and undermine its integrity as an open source of knowledge. Examples 
        include authoritarian regimes persecuting local Wikipedia editors for their role 
        in documenting conflicts like the war in Ukraine, or shady marketing firms 
        creating fake grassroots campaigns to promote companies and influence state 
        and local decision-making processes. The Wikipedia community, however, is 
        fighting back. Over the years, a number of community projects have been started 
        to counter these threats. The goal of this project is to compile the first 
        exhaustive map of these community efforts aimed at preserving the integrity of 
        Wikipedia and its sister projects, and to provide resources for those within the 
        community who are engaged in the active and ongoing process of countering 
        disinformation and advancing information literacy across the world.
      </p>
    </Paper>
  );
};

export default ProjectDescription;
