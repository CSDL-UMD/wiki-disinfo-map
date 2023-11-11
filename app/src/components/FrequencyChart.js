import React, { Component } from 'react';
import { Paper, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';
import { createRangeFilter } from '../utils';

// Percent of y-range to offset the y domain
const yOffset = 0.1;
// calculate y-domain from min and max y-vals
const yDomain = ([dataMin, dataMax]) => [
  // Math.round(dataMin - yOffset * (dataMax - dataMin)),
  0,
  Math.ceil(dataMax + yOffset * (dataMax - dataMin)),
];

// transform csv data to get frequencies of
const getFrequencies = (data, column) => {
  const values = data.map((x) => Number(x[column])).filter((x) => !isNaN(x));

  // get counts
  const counts = {};
  for (const num of values) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  // convert to array
  const countsData = [];
  for (const key in counts) {
    const item = { count: counts[key] };
    item[column] = Number(key);
    countsData.push(item);
  }

  // sort by column
  countsData.sort((a, b) => a[column] - b[column]);
  return countsData;
};

// In a list of objects, get index of object which has key->val pair
const getKVIndex = (data, key, value) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i][key] === value) {
      return i;
    }
  }
  return -1;
};

export default class FrequencyChart extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      data: getFrequencies(props.data, props.column),
      left: 'dataMin',
      right: 'dataMax',
      refAreaLeft: '',
      refAreaRight: '',
      // specifies both top and bottom
      yDomain: yDomain,
      animation: true,
      xKey: props.column,
      yKey: 'count',
      filterId: -1,
    };
    // initialize state
    this.state = this.initialState;
  }

  getAxisYDomain = (from, to, xRef, ref) => {
    // get from and to indices
    const { data } = this.state;
    from = getKVIndex(data, xRef, from);
    to = getKVIndex(data, xRef, to);

    const refData = data.slice(from, to + 1);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return yDomain([bottom, top]);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      // component data updated
      this.setState(() => ({
        left: 'dataMin',
        right: 'dataMax',
        refAreaLeft: '',
        refAreaRight: '',
        // specifies both top and bottom
        yDomain: yDomain,
      }));
      this.setState(() => ({
        data: getFrequencies(this.props.data, this.props.column),
      }));
    }
  }

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data, xKey, yKey, filterId } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      this.setState(() => ({
        refAreaLeft: '',
        refAreaRight: '',
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    const yDomain = this.getAxisYDomain(refAreaLeft, refAreaRight, xKey, yKey);

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      yDomain: yDomain,
    }));

    // create new filter
    const newFilter = createRangeFilter(xKey, refAreaLeft, refAreaRight);
    // remove old filter
    this.props.removeFilter(filterId);
    // add new filter and reset the state
    this.setState({
      filterId: this.props.addFilter(newFilter),
    });
  }

  render() {
    const {
      data,
      // barIndex,
      left,
      right,
      refAreaLeft,
      refAreaRight,
      yDomain,
      xKey,
      yKey,
    } = this.state;

    return (
      <Paper style={{ padding: '5px' }}>
        <div
          className="highlight-bar-charts"
          style={{ userSelect: 'none', width: '100%' }}
        >
          <Typography variant="h6" gutterBottom align="center">
            Frequency of {xKey}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={800}
              height="100%"
              data={data}
              onMouseDown={(e) =>
                this.setState({ refAreaLeft: e?.activeLabel || '' })
              }
              onMouseMove={(e) =>
                this.state.refAreaLeft &&
                this.setState({ refAreaRight: e.activeLabel })
              }
              // eslint-disable-next-line react/jsx-no-bind
              onMouseUp={this.zoom.bind(this)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                allowDataOverflow
                dataKey={xKey}
                domain={[left, right]}
                type="number"
              />
              <YAxis
                allowDataOverflow
                dataKey={yKey}
                domain={yDomain}
                type="number"
                yAxisId="1"
                label={{
                  value: yKey,
                  angle: -90,
                }}
              />
              <Tooltip />
              <Line
                yAxisId="1"
                type="linear"
                dataKey={yKey}
                stroke="#8884d8"
                animationDuration={300}
              />

              {refAreaLeft && refAreaRight ? (
                <ReferenceArea
                  yAxisId="1"
                  x1={refAreaLeft}
                  x2={refAreaRight}
                  strokeOpacity={0.3}
                />
              ) : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Paper>
    );
  }
}
