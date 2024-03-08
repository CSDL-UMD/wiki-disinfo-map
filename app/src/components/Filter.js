import React, { Component } from 'react';
import { Autocomplete } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { createFilterComponentFilter } from '../utils';

// get all the options of countries in the format of the MUI Autocomplete component
const get_options_countries = (data) => {
  const select_options = []; // this will store the options in a format agreeable to the select component
  const countries = new Set();

  if (!data) {
    return [];
  }
  // get unique countries
  for (let rowNum = 0; rowNum < data.length; rowNum++) {
    const row = data[rowNum];

    // check if the item is already included in options (since some are repeated)
    for (let country of row['Countries']) {
      if (!countries.has(country.trim())) {
        countries.add(country);
      }
    }
  }

  // add to JSON format acceptable by autocomplete component
  // NOTE: In the future, map country code to code using json file in data folder
  for (const country of countries) {
    select_options.push({ /* code: [INSERT MAPPED CODE] */ label: country });
  }

  return select_options;
};

// get all the options in the format of the MUI Autocomplete component
const get_options_languages = (data) => {
  let options = [];
  const select_options = []; // this will store the options in a format agreeable to the select component

  if (!data) {
    return [];
  }
  // get unique languages
  for (let rowNum = 0; rowNum < data.length; rowNum++) {
    const row = data[rowNum];

    if (row['Languages'] !== 'NA') {
      // check if the item is already included in options (since some are repeated)
      options = [...new Set([...options, ...row['Languages']])];
    }
  }

  // get the options in the format for MUI component
  for (const option of options) {
    select_options.push({ label: option });
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
      originalDataLen: props.data.length,
      selectedOption: null,
      filterId: -1,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      // check if data was reset to original
      if (this.props.data.length === this.state.originalDataLen) {
        // set option to null
        this.setState({
          selectedOption: null,
        });
      }
    }
  }

  onChange(event, value) {
    const { column, filterId } = this.state;
    this.setState({
      selectedOption: value,
    });

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
    const { column, selectedOption } = this.state;
    if (column === 'Countries') {
      return (
        <Autocomplete
          id="country-select"
          fullWidth={true}
          options={
            this.props.column === 'Countries'
              ? get_options_countries(this.props.data)
              : this.props.column === 'Languages'
              ? get_options_languages(this.props.data)
              : []
          }
          value={selectedOption}
          onChange={this.onChange.bind(this)}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              {/* <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              /> */}
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`Choose ${column}`}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
        />
      );
    } else {
      return (
        <Autocomplete
          id="language-select"
          fullWidth={true}
          options={get_options_languages(this.props.data)}
          value={selectedOption}
          onChange={this.onChange.bind(this)}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`Choose ${column}`}
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
