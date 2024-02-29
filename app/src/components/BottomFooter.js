import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Link } from "@mui/material";
import Brightness3Icon from '@mui/icons-material/Brightness3';
import GitHubIcon from '@mui/icons-material/GitHub';

const BottomFooter = ({
  toggleTheme
}) => {
    return (
      <Box marginTop={5}>
          <BottomNavigation
            showLabels
            value={0}
            // onChange={(event, newValue) => {
            //   setValue(newValue)
            // }}
            sx={{
              backgroundColor: "#add8e6",
              color: "white",
            }}
          >
            <BottomNavigationAction icon={<Link href='https://github.com/CSDL-UMD/wiki-disinfo-map'><GitHubIcon /></Link>}/>
            <BottomNavigationAction icon={<Link onClick={toggleTheme}><Brightness3Icon /></Link>}></BottomNavigationAction>

          </BottomNavigation>
      </Box>
    );
};

export { BottomFooter };