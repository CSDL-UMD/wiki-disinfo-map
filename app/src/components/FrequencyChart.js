import React, { Component } from 'react';
import { Button, Paper } from '@mui/material';
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
  // const values = data.map((x) => Number(x[column]));
  // TODO: fix data to only be numbers
  const values = [];
  for (const el of data) {
    if (!isNaN(Number(el[column]))) {
      values.push(Number(el[column]));
    }
  }

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

    this.initialData = getFrequencies(props.data, props.column);
    this.initialState = {
      data: this.initialData,
      left: 'dataMin',
      right: 'dataMax',
      refAreaLeft: '',
      refAreaRight: '',
      // specifies both top and bottom
      yDomain: yDomain,
      animation: true,
    };
    // initialize state
    this.state = this.initialState;
    this.state['xKey'] = props.column;
    this.state['yKey'] = 'count';
  }

  getAxisYDomain = (from, to, xRef, ref) => {
    // get from and to indices
    from = getKVIndex(this.initialData, xRef, from);
    to = getKVIndex(this.initialData, xRef, to);

    const refData = this.initialData.slice(from, to + 1);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return yDomain([bottom, top]);
  };

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data, xKey, yKey } = this.state;

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

    // TODO:
    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      yDomain: yDomain,
    }));
  }

  zoomOut() {
    // reset zoom
    this.setState(() => this.initialState);

    // TODO: use callback to tell parent of update
    // xlo, xhi
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={800}
              height={400}
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
                label={{
                  value: xKey,
                  position: 'insideBottom',
                  offset: '-10',
                }}
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
                type="natural"
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
          <div
            className="button-container"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              className="btn update"
              variant="contained"
              onClick={this.zoomOut.bind(this)}
            >
              Reset Zoom
            </Button>
          </div>
        </div>
      </Paper>
    );
  }
}
