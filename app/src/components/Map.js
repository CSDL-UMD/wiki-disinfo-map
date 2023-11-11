import React, { useEffect, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from 'react-simple-maps';
import { Paper } from '@mui/material';
import { Tooltip } from 'react-tooltip';
import { createContainsFilter } from '../utils';
// css
import './Map.css';

// map features
// const mapFeatures = require('./mapFeatures.json');
const mapFeatures = require('./continents.json');


const listValueCounts = (data, column) => {
  const counts = {};

  for (const row of data) {
    for (const key of row[column]) {
      counts[key] = counts[key] ? counts[key] + 1 : 1;
    }
  }
  // transform to array of objects
  return Object.keys(counts).map((key) => {
    const item = { count: counts[key] };
    item[column] = key;
    return item;
  });
};

const Map = (props) => {
  const [mapCounts, setMapCounts] = useState(
    listValueCounts(props.data, 'Continent')
    // listValueCounts(props.data, 'Country')
  );
  const [tooltipContent, setTooltipContent] = useState('');
  const [filterId, setFilterId] = useState(-1);

  const maxCount = mapCounts.reduce((a, b) => Math.max(a, b.count), 0);
  const colorScale = scaleLinear()
    .domain([0, maxCount])
    .range(['#ffedea', '#15008c']);
    
  useEffect(() => {
    setMapCounts(listValueCounts(props.data, 'Continent'));
    // setMapCounts(listValueCounts(props.data, 'Country'));
  }, [props.data]);

  // const onCountryClick = (countryName) => {
  //   if (!mapCounts.find(((elem) => elem.Country === countryName))) { // checks if country has no projects
  //     // do nothing
  //   } else {
  //     props.removeFilter(filterId)
  //     let newFilter = createContainsFilter("Country", countryName)
  //     setFilterId(props.addFilter(newFilter))
  //   }
  // }

  const onContinentClick = (continentName) => {
    console.log(continentName);
    if (!mapCounts.find(((elem) => elem.Continent === continentName))) { // checks if country has no projects
      // do nothing
    } else {
      props.removeFilter(filterId)
      let newFilter = createContainsFilter("Continent", continentName)
      setFilterId(props.addFilter(newFilter))
    }
  }

  return (
    <Paper>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        className="map-chart"
        id="map"
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          {mapCounts.length > 0 && (
            <Geographies geography={mapFeatures}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = mapCounts.find(
                    // (s) => s.Country === geo.properties.name
                    (s) => s.Continent === geo.properties.continent
                  );

                  return (
                    <Geography
                      key={geo.rsmKey}
                      style={{
                        hover: { 
                          // fill: "#04D",
                          stroke: "#FFFFFF", // Border color on hover
                          strokeWidth: 2, // Border width on hover
                        },
                        // pressed: { fill: "#02A" }
                      }}
                      geography={geo}
                      fill={d ? colorScale(d.count) : '#ffffff'}
                      onMouseEnter={() => {
                        console.log(d);
                        setTooltipContent(
                          `${geo.properties.continent}: ${d ? d.count : 0}`
                          //`${geo.properties.Country}: ${d ? d.count : 0}`
                        );
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      // onClick={() => {
                      //   // onCountryClick(geo.properties.name);
                      //   onCountryClick(geo.properties.Country);
                      // }}
                      onClick={() => {
                        // onCountryClick(geo.properties.name);
                        onContinentClick(geo.properties.continent);
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip anchorId="map" content={tooltipContent} float />
    </Paper>
  );
};

export default Map;
