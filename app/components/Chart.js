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
    this.getRandomColor = this.getRandomColor.bind(this)
  }

  getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }


  drawChart(){

    // console.log('props',this.props.chartData);

    var myLineChart = new Chart(document.getElementById("line-chart"), {
          type: 'bar',
          data: {
            labels: this.props.chartData,
            datasets: [{
                data: this.props.chartData,
                label: "Active Users",
                backgroundColor: this.getRandomColor(),
                highlightFill:this.getRandomColor()
              }
            ]
          },
          options: {
            responsive: true,
            mode: null,
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 10
                }
            },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "white",
                    beginAtZero: true
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: "white",
                }
            }]
        },
            title: {
              display: true,
              text: 'User Activity History',
              fontColor: 'white'
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
    return (
      <div className="col-sm-12 col-md-4 col-lg-4">
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
