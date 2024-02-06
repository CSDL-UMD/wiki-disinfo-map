# wiki-disinfo-map

A website compiling disinformation-combatting efforts within the Wikimedia community

## Development

1. Install dependencies (in `./app` directory).
   ```bash
   ./app % npm install
   ```
1. Run our data fetching and processing file (in `./app/src/data` directory).
   ```bash
   ./app/src/data % node.js
   ```
1. Start development server (in `./app` directory).
   ```bash
   ./app % npm run start
   ```

## Static Site Generation

Note: Our GitHub Action "Deploy to GitHub Pages" does this process and places static files on `gh-pages` branch

1. Run our data fetching and processing file (in `./app/src/data` directory).
   ```bash
   ./app/src/data % node.js
   ```
1. Generate static site (in `.app` directory).
   ```bash
   ./app % npm run build
   ```
