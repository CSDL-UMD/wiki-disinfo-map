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

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Container maxWidth={false}>
          <AppBar resetData={resetData} />
          <Grid container spacing={2} justify="flex-end" alignItems="center">
            <Grid item xs={12} md={8} xl={6}>
              {/* Map */}
              <Map 
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} xl={6}>
              <FrequencyChart
                column="Year"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} xl={6}>
              <FrequencyChart
                column="Year"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {/* Project Description */}
                  <ProjectDescription />
                </Grid>

                {/* Search */}
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {/* Country Filter */}
                      <Filter
                        resetData={resetData}
                        column="Country"
                        data={currData}
                        addFilter={addFilter}
                        removeFilter={removeFilter}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/* Language Filter */}
                      <Filter
                        resetData={resetData}
                        column="Languages"
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

            <Grid item xs={12} sm={6} md={4}>
              <PieChart
                column="Country"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PieChart
                column="Region"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PieChart
                column="Group"
                data={currData}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
