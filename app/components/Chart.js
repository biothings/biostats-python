import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Chart from 'chart.js';


class ChartComp extends React.Component {
  constructor() {
    super()
    this.state = {
      data:[]
    }

    this.addComma = this.addComma.bind(this)
    this.drawChart = this.drawChart.bind(this)
  }
  addComma(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  drawChart(arr){

    var myLineChart = new Chart(document.getElementById("line-chart"), {
          type: 'bar',
          data: {
            labels: arr,
            datasets: [{
                data: arr,
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
    let arr = this.props.chartData;
    this.drawChart(arr);
  }


  componentDidMount() {


  }

  render() {
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
