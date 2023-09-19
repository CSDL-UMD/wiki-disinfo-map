const fs = require('fs')
const { parse } = require("csv-parse");

// @returns rows, columns
async function retrieve_data() {
  return new Promise((resolve, reject) => {
    // accumulate all the data for the webpage in this structure
    const data = [];
    // read CSV input stream
    fs.createReadStream("./wiki_disInfo_data.csv")
        .pipe(
            parse({
                delimiter: ",",
                columns: true,
                ltrim: true,
            })
        ).on("data", (row) => {
            // NOTE: for the purposes of the table component, the rows have to be associated with an ID
            const translations = {
              'Project': 'id1',
              'Description': 'id2', 
              'Languages': 'id3',
              'Country': 'id4',
              'Region': 'id5',
              'Year': 'id6',
              'Group': 'id7',
            }

            for (key in translations) {
              // get the translations (ex. id6)
              let id = translations[key];

              // assign the row value for the key that is associated with that ID to a new key
              row[id] = row[key];

              // delete the duplicate key under the non-ID name
              delete row[key]
            }

            // pre-process data directly when scanning each row
            delete row['KeyDisinfo'];
            delete row['Country code'];
            delete row['Subcontinent/Continent code'];
            delete row['Link'];
            delete row['Type'];
            delete row['Wikimedia project'];

            data.push(row);
        }).on("error", (error) => {
            console.log(error.message)
        }).on("end", () => {
            console.log("parsed csv data:");
            // console.log(data);

            // attach an id to each row
            for (let i = 0; i < data.length; i++) {
              let row = data[i];
              row['id'] = 'id' + (i + 1);            
            }

            // data in this context is rows
            resolve(data);
        });
  });
}

async function main() {
  const data = await retrieve_data()
  
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
  console.error("An error occurred:", error);
})