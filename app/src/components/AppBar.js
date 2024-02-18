import Typography from '@mui/material/Typography';

import { AppBar, Button, Toolbar } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import logo from './../umd_logo_raster.png';

export default function ButtonAppBar({ aboutRef }) {
  const submit_form = 'https://forms.gle/cC3Vfu15uVckxCV7A';
  const aboutOnClick = () =>
    aboutRef.current.scrollIntoView({ behavior: 'smooth' });

  return (
    <AppBar position="sticky">
      <Toolbar>
        <img
          src={logo}
          alt=""
          style={{ width: '50px', height: 'auto', marginRight: '0px' }}
        ></img>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button
          color="inherit"
          onClick={aboutOnClick}
          endIcon={<InfoIcon />}
          style={{ margin: '0 5px' }}
        >
          About
        </Button>
        <Button
          color="inherit"
          href={submit_form}
          target="_blank"
          endIcon={<OpenInNewIcon />}
          style={{ margin: '0 5px' }}
        >
          Submit Entry
        </Button>
      </Toolbar>
    </AppBar>
  );
}
