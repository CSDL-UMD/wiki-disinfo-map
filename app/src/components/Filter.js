import React, { Component } from 'react';
import { Autocomplete, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { createFilterComponentFilter } from '../utils';

// get all the options of countries in the format of the MUI Autocomplete component
const get_options_countries = (data) => {
  const options = []
  const select_options = [] // this will store the options in a format agreeable to the select component

  if (!data) {
    return []
  }
  // get unique countries
  for (let rowNum = 0; rowNum < data.length; rowNum++) {
    const row = data[rowNum];

    if (row['Country'] !== 'NA' && row['Country'] !== 'Multiple (NA)') {
      // check if the item is already included in options (since some are repeated)
      let item;

      item = [row['Country code'].substring(0, row['Country code'].length - 1), row['Country']];
      const included = options.some(option => option.length === item.length && option.every((value, index) => value === item[index]));

      if (!included) {
        options.push(item);
      }
    }
  }

  for (const option of options) {
    if (!select_options.includes({code: option[0], label: option[1]})) select_options.push({code: option[0], label: option[1]});
  }
  return select_options;
};

// get all the options in the format of the MUI Autocomplete component
const get_options_languages = (data) => {
  let options = []
  const select_options = [] // this will store the options in a format agreeable to the select component

  if (!data) {
    return []
  }
  // get unique languages
  for (let rowNum = 0; rowNum < data.length; rowNum++) {
    const row = data[rowNum];
    row.Languages = String(row.Languages).split(',').filter((lang) => lang !== 'NA')

    if (row['Languages'] !== 'NA') {
      // check if the item is already included in options (since some are repeated)
      options = [...new Set([...options, ...row.Languages])];
    }
  }

  // get the options in the format for MUI component
  for (const option of options) {
    select_options.push({label: option});
  }
  return select_options;
};

export default class Filter extends Component {
  constructor(props) {
    super(props);

    // initialize state
    this.state = {
      column: props.column,
      data: props.data,
      selectedOption: null,
      options_countries: get_options_countries(props.data),
      options_languages: get_options_languages(props.data),
      firstFilterApplied: false,
      filterId: -1,
    }

    // this.onChange.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data && this.state.firstFilterApplied) {
      // component data updated
      // this.setState(() => { this.props.resetData() })
    }
  }

  onChange(event, value) {
    const { column, filterId } = this.state;
    this.props.removeFilter(filterId);
    if (value) {
      // create new filter
      const newFilter = createFilterComponentFilter(column, value);
      
      // add new filter and reset the state
      this.setState({
        filterId: this.props.addFilter(newFilter),
      });
    }
  }

  render() {
    const {options_countries, options_languages, column} = this.state;
    if (column === "Country") {
      return (
        <Autocomplete
          id="country-select"
          fullWidth={true}
          options={this.props.column === "Country" ? options_countries : options_languages}
          onChange={this.onChange.bind(this)}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              />
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`Choose a ${column}`}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
        />
      );
    }  else {
      return (
        <Autocomplete
          id="language-select"
          fullWidth={true}
          options={options_languages}
          onChange={this.onChange.bind(this)}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`Choose a ${column}`}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
        />
      );
    }
  }
}