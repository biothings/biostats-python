import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Chart from 'chart.js';


class ChartComp extends React.Component {
  constructor() {
    super()
    this.state = {
      data:[],
    }

    this.drawChart = this.drawChart.bind(this)
  }


  drawChart(){

    console.log('props',this.props.chartData);

    var myLineChart = new Chart(document.getElementById("line-chart"), {
          type: 'bar',
          data: {
            labels: this.props.chartData,
            datasets: [{
                data: this.props.chartData,
                label: "Active Users",
                backgroundColor: 'white'
              }
            ]
          },
          options: {
            responsive: true,
            mode: null,
            legend: { display: false },
            title: {
              display: true,
              text: 'User Activity',
              color: 'white'
            }
          }
        });
  }

  componentDidUpdate() {
    this.drawChart();
  }


  componentDidMount() {


  }

  render() {
    console.log('render happening')
    return (
      <div style={{flex:1}}>
        <canvas style={{height:'px !important'}} id="line-chart" width="100%" ></canvas>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    'mapData' : state.mapData,
    'chartData': state.chartData
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(ChartComp)
