import './App.css';
import { useState } from 'react';
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
  const [currData, setCurrData] = useState(initialData.slice());

  const resetData = () => {
    setCurrData(initialData);
  };

  const rangeFilterData = (column, lo, hi) => {
    setCurrData(
      currData.filter((item) => {
        const val = Number(item[column]);
        return lo <= val && val <= hi;
      })
    );
  };

  const rangeFilterStrings = (column, str) => {
    resetData();
    setCurrData(
      currData.filter((item) => {
        let arr = item[column]

        // Languages could typically be an array, so we iterate through to find label
        if (column === "Languages") {
          for (let i = 0 ; i < arr.length; i++) {
            if (arr[i] === str['label']) {
              return true;
            }
          }

          return false
        } else {
          const val = String(item[column]);   
          return val == str['label'];
        }
      })
    );

  };

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
                  <Filter 
                  resetData={resetData}
                  column="Country" 
                  data={currData}
                  rangeFilterStrings={rangeFilterStrings}/>
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* Language Filter */}
                  <Filter
                  resetData={resetData}
                  column="Languages" 
                  data={currData}
                  rangeFilterStrings={rangeFilterStrings} />
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
