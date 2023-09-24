import Typography from '@mui/material/Typography';

import { AppBar, Button, Box, Toolbar } from '@mui/material';

export default function ButtonAppBar({ resetData }) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Wikimedia Disinformation Map
        </Typography>
        <Button color="inherit" onClick={resetData}>
          Reset Filters
        </Button>
      </Toolbar>
    </AppBar>
  );
}
