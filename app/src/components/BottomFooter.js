import React from 'react';
import { Link } from "@mui/material";
import Brightness3Icon from '@mui/icons-material/Brightness3';
import GitHubIcon from '@mui/icons-material/GitHub';
import {Paper, Stack} from '@mui/material';
import {IconButton} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const BottomFooter = ({
  toggleTheme,
  darkTheme
}) => {
    console.log(darkTheme)
    return (
      <Paper elevation={3} style={{ padding: '1rem' }}>
      <Stack direction="row" spacing={2} justifyContent={'center'}>
        <Link href='https://github.com/CSDL-UMD/wiki-disinfo-map'>
          <IconButton color="primary">
            <GitHubIcon />
          </IconButton>
        </Link>
        <Link onClick={toggleTheme}>
          <IconButton color="primary">
            {darkTheme ?  <WbSunnyIcon /> : <Brightness3Icon />}
          </IconButton>
        </Link>
      </Stack>
    </Paper>
    );
};

export { BottomFooter };
