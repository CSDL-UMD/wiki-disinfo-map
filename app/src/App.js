import './App.css';
import { useState, useEffect } from 'react';
// mui
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Grid } from '@mui/material';
// component imports
import {
  AppBar,
  Filter,
  FrequencyChart,
  Map,
  PieChart,
  ProjectDescription,
  Table,
} from './components';
const initialData = require('./data/data.json');

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [filterIdCounter, setFilterIdCounter] = useState(0);
  const [currData, setCurrData] = useState(initialData.slice());
  const [filters, setFilters] = useState([]);

  // reset all filters (which will reset all data)
  const resetData = () => {
    setFilters([]);
  };

  // Add a filter to the data and returns the id of the filter
  // A filter must be a function which takes only a single parameter (data) and
  // returns any subset of the data
  const addFilter = (f) => {
    // create filter id
    const id = filterIdCounter;
    setFilters([...filters, { filter: f, id }]);

    // increment counter
    setFilterIdCounter(id + 1);
    return id;
  };

  // remove a filter with the given filter id
  const removeFilter = (fId) => {
    setFilters(filters.filter(({ filter: fun, id }) => id !== fId));
  };

  // When filters added or removed, rerun all filters on initialData
  useEffect(() => {
    // apply each filter to initialData
    let data = initialData;
    for (const { filter } of filters) {
      data = filter(data);
    }

    // set currData
    setCurrData(data);
  }, [filters]);

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Container maxWidth={false}>
          <AppBar resetData={resetData} />
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
              <Table data={currData} />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <FrequencyChart
                column="Year"
                data={currData}
                rangeFilterData={rangeFilterData}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <PieChart column="Country" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <PieChart column="Subcontinent" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <PieChart column="Project" />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
