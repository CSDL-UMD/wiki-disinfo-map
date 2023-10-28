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

  const maxCount = mapCounts.reduce((a, b) => Math.max(a, b.count), 0);
  const colorScale = scaleLinear()
    .domain([0, maxCount])
    .range(['#ffedea', '#15008c']);

  useEffect(() => {
    console.log('props data updated');
    setMapCounts(listValueCounts(props.data, 'Country'));
  }, [props.data]);

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
