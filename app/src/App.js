import './App.css';
// mui
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Grid } from '@mui/material';
// component imports
import {
  Filter,
  LineChart,
  Map,
  PieChart,
  ProjectDescription,
  Table,
} from './components';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth={false}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {/* MAP */}
              <Map />
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Project Description */}
              <ProjectDescription />

              {/* Search */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {/* Continent Filter */}
                  <Filter column="Continent" />
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Language Filter */}
                  <Filter column="Languages" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              {/* Data table */}
              <Table />
            </Grid>

            <Grid item xs={3}>
              <LineChart column="Start Year" />
            </Grid>
            <Grid item xs={3}>
              <PieChart column="Country" />
            </Grid>
            <Grid item xs={3}>
              <PieChart column="Subcontinent" />
            </Grid>
            <Grid item xs={3}>
              <PieChart column="Project" />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
