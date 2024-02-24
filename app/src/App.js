import './App.css';
import { useState, useEffect, useRef } from 'react';
import 'animate.css';
// mui
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container,
  CssBaseline,
  Grid,
  Typography,
  Button,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
// component imports
import {
  AppBar,
  ContributingDescription,
  DevelopmentDescription,
  Filter,
  FrequencyChart,
  Map,
  PieChart,
  ProjectDescription,
  Table,
  BottomFooter,
  IconTooltip,
} from './components';

const initialData = require('./data/data.json');

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [filterIdCounter, setFilterIdCounter] = useState(0);
  const [currData, setCurrData] = useState(initialData.slice());
  const [filters, setFilters] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  // const [value, setValue] = React.useState(0);

  // reset all filters (which will reset all data)
  const resetData = () => {
    setFilters([]);
  };

  const toggleTheme = () => {
    setIsDarkTheme((prevThem) => !prevThem);
  };

  // Add a filter to the data and returns the id of the filter
  // A filter must be a function which takes only a single parameter (data) and
  // returns any subset of the data
  const addFilter = (filterFun) => {
    // create filter id
    const id = filterIdCounter;
    setFilters((prevFilters) => [...prevFilters, { filterFun, id }]);

    // increment counter
    setFilterIdCounter((prevId) => prevId + 1);
    return id;
  };

  // remove a filter with the given filter id
  // for convenience, filter id's will never be negative, so a negative filter id can be used as a default value.
  const removeFilter = (fId) => {
    if (fId >= 0) {
      setFilters((prevFilters) =>
        prevFilters.filter(({ filterFun, id }) => {
          return id !== fId;
        })
      );
    }
  };

  // When filters added or removed, rerun all filters on initialData
  useEffect(() => {
    // apply each filter to initialData
    let data = initialData;
    for (const { filterFun } of filters) {
      data = filterFun(data);
    }

    // set currData
    setCurrData(data);
  }, [filters]);

  const aboutRef = useRef(null);

  return (
    <div className="App">
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline />

        <Container maxWidth={false}>
          <div
            style={{
              position: 'fixed',
              bottom: '0.5%',
              right: 25,
              width: 353,
              height: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              zIndex: 999,
            }}
          ></div>
          <Button
            color="error"
            onClick={resetData}
            variant="contained"
            style={{
              position: 'fixed',
              bottom: '0%',
              right: 32,
              transform: 'translateY(-30%)',
              zIndex: 999,
            }}
          >
            <RestartAltIcon />
            Reset Filters
          </Button>
          <AppBar aboutRef={aboutRef} />
          <Typography
            marginTop={5}
            className="animate__animated animate__fadeInDown animate__delay-1.5s"
            variant="h1"
            align="center"
          >
            Disinformation Map
          </Typography>
          <Typography
            marginTop={3}
            className="animate__animated animate__fadeInDown animate__delay-3s"
            variant="h6"
            align="center"
          >
            A map to visualize it all. Beware of the Russians.
          </Typography>
          <Grid container spacing={2} justify="flex-end" alignItems="center">
            <Grid
              item
              xs={12}
              md={8}
              xl={6}
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Map */}
              <Map
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />

              <IconTooltip></IconTooltip>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {/* Country Filter */}
                      <Filter
                        resetData={resetData}
                        column="Country/Countries"
                        data={currData}
                        addFilter={addFilter}
                        removeFilter={removeFilter}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/* Language Filter */}
                      <Filter
                        resetData={resetData}
                        column="Language(s)"
                        data={currData}
                        addFilter={addFilter}
                        removeFilter={removeFilter}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              {/* Data table */}
              <Table data={currData} />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <FrequencyChart
                column="Start Year"
                title="Frequency of Start Year"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <PieChart
                column="Country/Countries"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <PieChart
                column="Region"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <PieChart
                column="Group Association"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>

            <Grid item xs={12} ref={aboutRef} id="about">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {/* Project Description */}
                  <ProjectDescription />
                </Grid>

                {/* Search */}
                <Grid item xs={12} md={6}>
                  <Grid item xs={12}>
                    {/* Development Process Description */}
                    <DevelopmentDescription />
                    {/* Contributing Description */}
                    <ContributingDescription />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <BottomFooter toggleTheme={toggleTheme}></BottomFooter>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
