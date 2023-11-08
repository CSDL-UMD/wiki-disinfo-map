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
const mapFeatures = require('./mapFeatures.json');

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
    listValueCounts(props.data, 'Country')
  );
  const [tooltipContent, setTooltipContent] = useState('');
  const [filterId, setFilterId] = useState(-1);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const maxCount = mapCounts.reduce((a, b) => Math.max(a, b.count), 0);
  const colorScale = scaleLinear()
    .domain([0, maxCount])
    .range(['#ffedea', '#15008c']);
    
  useEffect(() => {
    console.log('props data updated');
    setMapCounts(listValueCounts(props.data, 'Country'));
  }, [props.data]);

  const onCountryClick = (countryName) => {
    if (!mapCounts.find(((elem) => elem.Country === countryName))) { // checks if country has no projects
      // do nothing
    } else {
      props.removeFilter(filterId)
      let newFilter = createContainsFilter("Country", countryName)
      setFilterId(props.addFilter(newFilter))
    }
  }

  function handleZoomIn() {
    if (position.zoom >= 6) return;
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
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}>
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          {mapCounts.length > 0 && (
            <Geographies geography={mapFeatures}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = mapCounts.find(
                    (s) => s.Country === geo.properties.name
                  );
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={d ? colorScale(d.count) : '#ffffff'}
                      onMouseEnter={() => {
                        setTooltipContent(
                          `${geo.properties.name}: ${d ? d.count : 0}`
                        );
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      onClick={() => {
                        onCountryClick(geo.properties.name);
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>

      <div className="controls">
        <button onClick={handleZoomIn}>
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
        <button onClick={handleZoomOut}>
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
      </div>

      <Tooltip anchorId="map" content={tooltipContent} float />
    </Paper>
  );
};

export default Map;
