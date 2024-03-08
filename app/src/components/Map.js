import React, { useEffect, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from 'react-simple-maps';
import { Paper } from '@mui/material';
import { Tooltip } from 'react-tooltip';
import { createContainsFilter } from '../utils';
import { Switch, FormControlLabel } from '@mui/material';
import Stack from '@mui/material/Stack';
import PublicIcon from '@mui/icons-material/Public';
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

  // console.log(counts)

  // transform to array of objects
  return Object.keys(counts).map((key) => {
    const item = { count: counts[key] };
    item[column] = key;
    return item;
  });
};

const Map = (props) => {
  const columnName = 'Continent';
  const originalCounts = listValueCounts(props.data, columnName);
  const [mapCounts, setMapCounts] = useState(
    listValueCounts(props.data, columnName)
  );
  const [tooltipContent, setTooltipContent] = useState('');
  const [filterId, setFilterId] = useState(-1);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const [globalSelected, setGlobalSelected] = useState(false);

  const globalText = "GLOBAL"
  const maxCount = mapCounts.reduce((a, b) => Math.max(a, b.count), 0);
  const colorScale = scaleLinear()
    .domain([0, maxCount])
    .range(['#ffedea', '#15008c']);
  const {isGlobalToggleChecked, setIsGlobalToggleChecked} = props;


  useEffect(() => {
    setMapCounts(listValueCounts(props.data, columnName));
  }, [props.data]);

  const onMapRegionClick = (columnName, regionName) => {
    props.removeFilter(filterId);

    if (!originalCounts.find((elem) => elem[columnName] === regionName)) {
      // checks if region has no projects
      // do nothing
    } else {
      let newFilter = createContainsFilter(columnName, regionName);
      setFilterId(props.addFilter(newFilter));
    }
  };

  function handleZoomIn() {
    if (position.zoom >= 3.375) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

  return (
    <Paper elevation={0}>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        className="map-chart"
        id="map"
      >
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        {mapCounts.length > 0 && (
          <Geographies geography={mapFeatures}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = mapCounts.find(
                  (s) => s[columnName] === geo.properties.continent
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    style={{
                      hover: {
                        fill: '#B2BEB5',
                        cursor: 'pointer',
                      },
                    }}
                    geography={geo}
                    fill={d ? colorScale(d.count) : '#525151'}
                    onMouseEnter={() => {
                      if (!globalSelected) {
                        setTooltipContent(
                          `${geo.properties.continent}: ${d ? d.count : 0}`
                        );
                      } else {
                        setTooltipContent(
                          `Global: ${originalCounts[0]['count']}`
                        );
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    onClick={() => {
                      if (!globalSelected) {
                        onMapRegionClick(columnName, geo.properties.continent);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>

      <div className="controls control-buttons">
        <Stack direction="row" spacing={2} className="custom-stack">
          
          <div style={{overflow: "hidden", position: 'fixed', bottom: 10, right: 206, paddingLeft: 12, backgroundColor: "rgba(119, 157, 210, 1)", borderRadius: "5px", zIndex: 999, }}>
           <FormControlLabel 
           control={<Switch
            color='primary'
            checked={isGlobalToggleChecked}
            onChange={() => {
              setIsGlobalToggleChecked((prevVal) => !prevVal)
              if (isGlobalToggleChecked) {
                // add logic
                props.removeFilter(filterId);
              } else {
                // add logic
                onMapRegionClick('Continent', 'Global');
              }
            }}
            inputProps={{ 'aria-label': 'controlled' }}
            >
          </Switch>} 
          label={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PublicIcon/>
              <span>GLOBAL</span>
            </div>
          }
          sx={{'& .MuiFormControlLabel-label': {color: "white",},}}
          />
          </div>
        
        </Stack>
      </div>

      <Tooltip anchorId="map" content={tooltipContent} float />
    </Paper>
  );
};

export default Map;
