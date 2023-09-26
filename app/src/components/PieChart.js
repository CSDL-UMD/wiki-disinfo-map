import React, { PureComponent, useEffect } from 'react';
import './PieChart.css';
import {
  PieChart as RechartsPieChart,
  Pie,
  Sector,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={'#0ea5e9'}>
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

/* overcomplicated demo code
<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
  {`(Rate ${(percent * 100).toFixed(2)}%)`}
</text>
*/

export default class PieChart extends PureComponent {
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
    if (this.state.clicks == 0) {
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
        data: this.props.data,
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
  };

  // onSectionClick = (index) => {
  //   // event handling for filtering data here
  //   // this.setState({

  //   // });
  //   useEffect(index)
  //   }

  render() {
    const pieStyle = { outline: 'none' };
    return (
      <ResponsiveContainer width="100%" height={250}>
        <RechartsPieChart width={400} height={400}>
          <Pie
            activeIndex={this.state.activeIndex}
            clicks={this.state.clicks}
            activeShape={renderActiveShape}
            data={data}
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
