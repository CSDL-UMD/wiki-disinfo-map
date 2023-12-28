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
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
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
  const [buttonText, setButtonText] = useState('Global');
  const [originalCounts, setOriginalCounts] = useState(
    listValueCounts(props.data, 'Continent')
  );
  const [mapCounts, setMapCounts] = useState(
    listValueCounts(props.data, 'Continent')
  );
  const [tooltipContent, setTooltipContent] = useState('');
  const [filterId, setFilterId] = useState(-1);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  

  const maxCount = mapCounts.reduce((a, b) => Math.max(a, b.count), 0);
  const colorScale = scaleLinear()
    .domain([0, maxCount])
    .range(['#ffedea', '#15008c']);

  useEffect(() => {
    setMapCounts(listValueCounts(props.data, 'Continent'));
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
    <Paper>
      

      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        className="map-chart"
        id="map"
      >
        
        <ZoomableGroup
          filterZoomEvent={(event) => {
            return event.type === 'wheel' ? false : true;
          }}
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          {mapCounts.length > 0 && (
            <Geographies geography={mapFeatures}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = mapCounts.find(
                    (s) => s.Continent === geo.properties.continent
                  );

                  return (
                    <Geography
                      key={geo.rsmKey}
                      style={{
                        hover: {
                          fill: '#B2BEB5',
                          cursor: 'pointer'
                        },
                      }}
                      geography={geo}
                      fill={d ? colorScale(d.count) : '#525151'}
                      onMouseEnter={() => {
                        if (buttonText === "Global") {
                          setTooltipContent(
                            `${geo.properties.continent}: ${d ? d.count : 0}`
                          );
                        } else {
                          console.log(originalCounts)
                          setTooltipContent(`Global: ${originalCounts[0]['count']}`)
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      onClick={() => {
                        if (buttonText === "Global") {
                          onMapRegionClick('Continent', geo.properties.continent);
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>

      <div className="controls control-buttons">
        <button id="1" onClick={handleZoomIn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button id="2" onClick={handleZoomOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <Stack direction="row" spacing={2} className="custom-stack">
          <Button 
            variant="contained" 
            className="custom-button"
            onClick={() => {
              
              if (buttonText === 'Back') {
                // add logic
                props.removeFilter(filterId);
                setButtonText("Global");
              } else {
                // add logic
                onMapRegionClick('Continent', 'Global');
                setButtonText("Back");
              }
            }}>
            {buttonText}
          </Button>
        </Stack>
      </div>

      

      <Tooltip anchorId="map" content={tooltipContent} float />
    </Paper>
  );
};

export default Map;
