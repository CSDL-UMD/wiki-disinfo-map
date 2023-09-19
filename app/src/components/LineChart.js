import React, { PureComponent } from 'react';
import { Paper } from '@mui/material';
import {
  Label,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';

const initialData = [
  { name: 1, cost: 4.11, impression: 100 },
  { name: 2, cost: 2.39, impression: 120 },
  { name: 3, cost: 1.37, impression: 150 },
  { name: 4, cost: 1.16, impression: 180 },
  { name: 5, cost: 2.29, impression: 200 },
  { name: 6, cost: 3, impression: 499 },
  { name: 7, cost: 0.53, impression: 50 },
  { name: 8, cost: 2.52, impression: 100 },
  { name: 9, cost: 1.79, impression: 200 },
  { name: 10, cost: 2.94, impression: 222 },
  { name: 11, cost: 4.3, impression: 210 },
  { name: 12, cost: 4.41, impression: 300 },
  { name: 13, cost: 2.1, impression: 50 },
  { name: 14, cost: 8, impression: 190 },
  { name: 15, cost: 0, impression: 300 },
  { name: 16, cost: 9, impression: 400 },
  { name: 17, cost: 3, impression: 200 },
  { name: 18, cost: 2, impression: 50 },
  { name: 19, cost: 3, impression: 100 },
  { name: 20, cost: 7, impression: 100 },
];

const getAxisYDomain = (from, to, ref) => {
  const refData = initialData.slice(from - 1, to);
  let [bottom, top] = [refData[0][ref], refData[0][ref]];
  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });

  return yDomain([bottom, top]);
};

// Percent of y-range to offset the y domain;
const yOffset = 0.1;
const yDomain = ([dataMin, dataMax]) => [
  Math.round(dataMin - yOffset * (dataMax - dataMin)),
  Math.round(dataMax + yOffset * (dataMax - dataMin)),
];
const initialState = {
  data: initialData,
  left: 'dataMin',
  right: 'dataMax',
  refAreaLeft: '',
  refAreaRight: '',
  // specifies both top and bottom
  yDomain: yDomain,
  animation: true,
};

export default class LineChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data } = this.state;

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
    const yDomain = getAxisYDomain(refAreaLeft, refAreaRight, 'cost');

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
    this.setState(() => initialState);

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
    } = this.state;

    return (
      <Paper>
        <div
          className="highlight-bar-charts"
          style={{ userSelect: 'none', width: '100%' }}
        >
          <button
            type="button"
            className="btn update"
            onClick={this.zoomOut.bind(this)}
          >
            Reset Zoom
          </button>

          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart
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
                dataKey="name"
                domain={[left, right]}
                type="number"
                // TODO: replace "year" with key name prop
                label={{
                  value: 'year',
                  // angle: -90,
                  position: 'bottom',
                }}
              />
              <YAxis
                allowDataOverflow
                domain={yDomain}
                type="number"
                yAxisId="1"
                // TODO: replace "cost" with key name prop
                label={{
                  value: 'cost',
                  angle: -90,
                  // position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Line
                yAxisId="1"
                type="natural"
                // TODO: replace "cost" with key name prop
                dataKey="cost"
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
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </Paper>
    );
  }
}
