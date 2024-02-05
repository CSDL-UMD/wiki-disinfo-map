import Typography from '@mui/material/Typography';

import { AppBar, Button, Toolbar } from '@mui/material';
import logo from "./../umd_logo_raster.png";

export default function ButtonAppBar({ resetData }) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <img src={logo} alt="" style={{ width: "50px", height: "auto" , marginRight: "0px"}}></img>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    
        </Typography>
        <Button color="inherit" onClick={resetData} variant="outlined">
          Reset Filters
        </Button>
      </Toolbar>
    </AppBar>
  );
}

/*
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
*/
