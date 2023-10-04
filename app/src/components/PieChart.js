import React, { Component } from 'react';
import { Typography } from '@mui/material';
import './PieChart.css';
import {
  PieChart as RechartsPieChart,
  Pie,
  Sector,
  ResponsiveContainer,
} from 'recharts';

const getData = (dataRaw, columnName) => {
  // gather all values of the given column
  const values = [];
  for (const oneRow of dataRaw) {
    values.push(oneRow[columnName])
  }

  // count occurrences in values (stole rishi's code lol)
  const counts = {};
  for (const num of values) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const data = [];
  // add data to pie chart data
  for (const key in counts) {
    data.push({ name: key, value: counts[key]});
  }

  return data;
}

const renderActiveShape = (props) => {
  // const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    payload,
  } = props;
  
  return (
    <g> 
      <text x={cx} y={cy+100} dy={8} textAnchor="middle" fill={'#0ea5e9'}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={'#0ea5e9'}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={'#0ea5e9'}
      />
    </g>
  );
};

export default class PieChart extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
      activeIndex: -1,
      clicks: 0,
    };

    this.state = this.initialState;
  }

  onPieEnter = (_, index) => {
    // console.log(this.state.clicked)
    if (this.state.clicks === 0) {
      this.setState({
        activeIndex: index,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) { 
    // TODO: will be a problem in filter combination, should not be based on data being different
    if (prevProps.data !== this.props.data) {
      // component data updated
      this.setState(() => ({
        data: this.props.data, // COME HERE FOR FILTERING
        activeIndex: -1,
        clicks: 0,
      }));
    }
  }

  onPieClick = (_, index) => {
    // useEffect(index)
    this.setState({
      activeIndex: index,
      clicks: this.clicks + 1,
      // TODO: call filter function here
    });
    // console.log(this.activeIndex)
    // this.props.rangeFilterData(this.props.column, data[this.activeIndex].name, data[this.activeIndex].name)
  };

  render() {
    return (
      <>
        <Typography variant="h6" gutterBottom align="center">
          {this.props.column}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <RechartsPieChart width={400} height={400}>
          <Pie
            activeIndex={this.state.activeIndex}
            clicks={this.state.clicks}
            activeShape={renderActiveShape}
            data={getData(this.props.data, this.props.column)}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={80}
            fill="#0c4a6e"
            dataKey="value"
            // TODO: Remove later. This changes active pie slice on hover
            // onMouseEnter={this.onPieEnter}
            onMouseDown={this.onPieClick}
            className="pie-chart"
            />
        </RechartsPieChart>
      </ResponsiveContainer>
            </>
    );
  }
}
