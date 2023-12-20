const fs = require('fs');
const { parse } = require('csv-parse');
const axios = require('axios');
const country_continent = require('./country-continent.json');
const sheets_id = "1-xgXuWPTuN2C9_VmT_7c6Vtn8Bc5Ns3wvoCpU7sHZEw";
const sheets_name = 'modified data';

const downloadCsv = async () => {
  const url = `https://docs.google.com/spreadsheets/d/${sheets_id}/gviz/tq?tqx=out:csv&sheet=${sheets_name}&headers=0`;
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
    });

    // Specify the path where you want to save the CSV file
    const outputPath = 'wiki_disinfo_data.csv';

    // Pipe the response stream to a file
    response.data.pipe(fs.createWriteStream(outputPath));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve(outputPath));
      response.data.on('error', (error) => reject(error));
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};


// @returns rows, columns
async function retrieve_data() {
  // download google sheet
  await downloadCsv();
  console.log("data downloaded from Google Sheets as csv")

  return new Promise((resolve, reject) => {    
    // accumulate all the data for the webpage in this structure
    const data = [];
    // read CSV input stream
    fs.createReadStream('./wiki_disinfo_data.csv')
      .pipe(
        parse({
          delimiter: ',',
          columns: true,
          ltrim: true,
        })
      )
      .on('data', (row) => {
        // pre-process data directly when scanning each row
        delete row['KeyDisinfo'];
        delete row['Link'];
        delete row['Type'];
        delete row['Wikimedia project'];
        delete row["Subcontinent/Continent code"];

        data.push(row);
      })
      .on('error', (error) => {
        console.log(error.message);
      })
      .on('end', () => {
        console.log('parsed csv data:');

        // preprocess row
        for (let i = 0; i < data.length; i++) {
          let row = data[i];
          row['id'] = 'id' + (i + 1);

          row = preprocessRow(row);
        }

        // data in this context is rows
        resolve(data);
      });
  });
}

async function main() {
  const data = await retrieve_data();

  // put the data into a JSON file
  let data_json = JSON.stringify(data, undefined, 3);

  /* NOTE: We are only returning the rows_json file since 
  the columns are universal and won't change too much
  ALSO, the columns are the keys in each JSON object...*/
  fs.writeFile('data.json', data_json, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

main().catch((error) => {
  console.error('An error occurred:', error);
});

const lookup_continent = (country) => {
  for (let i = 0; i < country_continent.length; i++) {
    if (country_continent[i].country === country) {
      return country_continent[i].continent;
    }
  }
}

const preprocessRow = async (row) => {
  // parse Start Year to number
  row['Year'] = Number(row['Year']);
  // parse country to list of countries
  row['Country'] = String(row['Country'])
    .split(',')
    .map((str) => str.trim())
    .filter(
      (country) =>
        country !== 'NA' &&
        country !== 'Multiple (NA)' &&
        country !== 'Multiple'
    );
  // parse languages to list of languages
  row.Languages = String(row.Languages)
    .split(',')
    .map((val) => val.trim())
    .filter(
      (lang) =>
        lang !== 'NA' && lang !== 'undefined' && lang !== '' && lang !== 'All'
    );

  row['Country code'] = String(row['Country code'])
    .split(',')
    .map((val) => val.trim())
    .filter((country) => country !== 'NA');

  row['Group'] = String(row['Group'])
    .split(',')
    .map((val) => val.trim())
    .filter((country) => country !== 'NA');

  row['Region'] = String(row['Region'])
    .split(',')
    .map((val) => val.trim())
    .filter((country) => country !== 'NA');

  row['Continent'] = [];
  for (let i = 0; i < row['Country'].length; i++) {
    const continent = lookup_continent(row['Country'][i])

    if (!row['Continent'].includes(continent)) {
      row['Continent'].push(continent);
    }
  }

  return row;
};
