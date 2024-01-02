import React, { Component } from 'react';
import { Paper, Typography } from '@mui/material';
import {
  PieChart as RechartsPieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { createValueFilter, createContainsFilter } from '../utils';

// css
import './PieChart.css';

const COLORS = ['#bae6fd', '#7dd3fc', '#0ea5e9', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49'];

const getData = (dataRaw, columnName) => {
  // gather all values of the given column
  const values = [];
  for (const oneRow of dataRaw) {
    if (oneRow[columnName] instanceof Array) {
      for (const oneVal of oneRow[columnName]) {
        values.push(oneVal);
      }
    } else {
      values.push(oneRow[columnName]);
    }
  }

  // count occurrences in values (stole rishi's code lol)
  const counts = {};
  for (const num of values) {
    if (num !== 'NA') {
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
  }

  const data = [];
  // add data to pie chart data
  for (const key in counts) {
    data.push({ name: key, value: counts[key] });
  }

  const comparator = (a, b) => b.value - a.value;
  data.sort(comparator);

  return data;
};

const getMaxCounts = (dataC) => {
  var counts_max = 0;

  for (const c of dataC) {
    if (c.value > counts_max) {
      counts_max = c.value;
    }
  }

  return counts_max;
};

// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value, index }) => {
//   const RADIAN = Math.PI / 180;
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//       {name} ({value})
//     </text>
//   );
// };

const renderActiveShape = (props) => {
  // const RADIAN = Math.PI / 180;
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } =
    props;

  return (
    <g>
      <text x={cx} y={cy + 100} dy={8} textAnchor="middle" fill={'#0ea5e9'}>
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={6} textAnchor="middle" fill={'#0ea5e9'}>
        {props.nameKey}
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
      hoverIndex: -1,
      dataCounts: getData(this.props.data, this.props.column),
      maxCount: getMaxCounts(getData(this.props.data, this.props.column)),
      filterId: -1,
      originalLength: this.props.data.length,
    };

    this.state = this.initialState;
  }

  onPieEnter = (_, index) => {
    this.setState(() => ({
      hoverIndex: index,
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    // only resets the visual of the pie chart if reset button was pressed
    if (prevProps.data !== this.props.data) {
      this.setState(() => ({
        dataCounts: getData(this.props.data, this.props.column),
        maxCount: getMaxCounts(getData(this.props.data, this.props.column)),
        activeIndex: -1,
        hoverIndex: -1,
      }));
    }
  }

  onPieClick = (_, index) => {
    const { dataCounts, filterId } = this.state;

    // remove old filter
    this.props.removeFilter(filterId);

    var newFilter;
    // create & add new filter
    if (this.props.data[0][this.props.column] instanceof Array) {
      newFilter = createContainsFilter(
        this.props.column,
        dataCounts[index].name
      );
    } else {
      newFilter = createValueFilter(this.props.column, dataCounts[index].name);
    }
    this.setState({
      activeIndex: index,
      filterId: this.props.addFilter(newFilter),
    });
  };

  render() {
    return (
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5" gutterBottom align="center" style={{fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"}}>
          {this.props.column}
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          {this.state.dataCounts.length <= 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography variant="h5" gutterBottom>
                No Data
              </Typography>
            </div>
          ) : (
            <RechartsPieChart width={400} height={400}>
              <Pie
                activeIndex={this.state.activeIndex}
                hoverIndex={this.state.hoverIndex}
                filterId={this.state.filterId}
                originalLength={this.state.originalLength}
                maxCount={this.state.maxCount}
                activeShape={renderActiveShape}
                // label={true}
                data={this.state.dataCounts}
                paddingAngle={2.5}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                fill="#ffffff"
                nameKey="name"
                dataKey="value"
                onMouseEnter={this.onPieEnter}
                onMouseDown={this.onPieClick.bind(this)}
                className="pie-chart"
              >
                {this.state.dataCounts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[Math.floor((entry.value / (this.state.maxCount + 1)) * COLORS.length)]} />
            ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          )}
        </ResponsiveContainer>
      </Paper>
    );
  }
}
