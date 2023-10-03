import React, { Component } from 'react';
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
  // const column = columnName(state);
  // const sin = Math.sin(-RADIAN * midAngle);
  // const cos = Math.cos(-RADIAN * midAngle);
  // const sx = cx + (outerRadius + 10) * cos;
  // const sy = cy + (outerRadius + 10) * sin;
  // const mx = cx + (outerRadius + 30) * cos;
  // const my = cy + (outerRadius + 30) * sin;
  // const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  // const ey = my;
  // const textAnchor = cos >= 0 ? 'start' : 'end';
  // added +100 in line 57 to move text below the pie chart
  
  return (
    <g> 
      <text x={cx} y={cy+100} dy={8} textAnchor="middle" fill={'#0ea5e9'}>
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={'#0369a1'}>
        {props.columnName}
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

/* overcomplicated demo code
<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
  {`(Rate ${(percent * 100).toFixed(2)}%)`}
</text>
*/

export default class PieChart extends Component {
  // static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si';

  constructor(props) {
    super(props);
    this.initialState = {
      activeIndex: 0,
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

  // useEffect = ((_, index) => {
  //   // make call to App filter function here
  //   console.log("hit")
  //   // visually highlight the selected section

  // }, []);

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      // component data updated
      this.setState(() => ({
        data: this.props.data, // COME HERE FOR FILTERING
        activeIndex: 0,
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

  // onSectionClick = (index) => {
  //   // event handling for filtering data here
  //   // this.setState({

  //   // });
  //   useEffect(index)
  //   }

  render() {
    // const pieStyle = { outline: 'none' };
    // columnName={column};
    return (
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
    );
  }
}
