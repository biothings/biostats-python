import React, { PropTypes } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import CountUp from 'react-countup';
import Chart from './Chart';
import Map from './Map';


class MyGene extends React.Component {

  constructor(props) {
    super(props);
    this.state={
        analyticsURL : 'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgICAmdKFCgw',
        realtimeURL:'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgIDAsbqFCgw',
        pagesURL: 'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgICAq_OHCgw',
        actionsURL: 'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgIDA8puGCgw',
        activeUsers: 0,
        totalUsers: 0,
        results:[],
        lastActiveUsers:0,
        mapData:[],
        pages: [],
        activeUsersHistory:[],
        timer: null,
        devices:[],
    }
    this.fetchAnalyticsData = this.fetchAnalyticsData.bind(this);
    this.fetchRealtimeUsers = this.fetchRealtimeUsers.bind(this);
    this.shapeMapData = this.shapeMapData.bind(this);
    this.addComma = this.addComma.bind(this);
    this.getUniqueItemsInTopPages = this.getUniqueItemsInTopPages.bind(this);
    this.drawPages = this.drawPages.bind(this);
    this.drawActions = this.drawActions.bind(this);
  }

  addComma(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  getUniqueItemsInTopPages(list){
    let pages =[]

    for (var i = 0; i < this.state.results.length; i++) {
      if (this.state.results[i][5] === '/') {
        this.state.results[i][5] = 'mygene.info/'
      }
      pages.push(this.state.results[i][5])
    }

    pages = pages.filter((x, i, a) => a.indexOf(x) == i)

    this.setState({
      'pages': pages
    })

  }

  drawPages(){
    axios.get(this.state.pagesURL).then(response=>{
      let res =[];
      let arr = response.data.rows;
      // console.log('pie res',response.data)
      res.push(['Endpoint', 'Sessions']);
      for (var i = 0; i < arr.length; i++) {
        res.push([arr[i][0],parseFloat(arr[i][1])]);
      }

      // console.log('final arr', res)

      google.charts.load('current', {packages: ['corechart', 'bar']});
      google.charts.setOnLoadCallback(drawBasic);

      function drawBasic() {

            var data = google.visualization.arrayToDataTable(res);

            var options = {
              title: 'Top 5 Endpoints',
              chartArea: {width: '50%'},
              hAxis: {
                title: 'Sessions',
                minValue: 0
              },
              vAxis: {
                title: 'Endpoint'
              },
              'tooltip' : {
                trigger: 'none'
              }
            };

            var chart = new google.visualization.BarChart(document.getElementById('chart_pages'));

            chart.draw(data, options);
          }
    })

  }

  drawActions(){
    axios.get(this.state.actionsURL).then(response=>{
      let res =[];
      let arr = response.data.rows;
      // console.log('pie res',response.data)
      res.push(['Action', 'Sessions']);
      for (var i = 0; i < arr.length; i++) {
        res.push([arr[i][0],parseFloat(arr[i][1])]);
      }

      // console.log('final arr', res)

      google.charts.load('current', {packages: ['corechart', 'bar']});
      google.charts.setOnLoadCallback(drawBasic);

      function drawBasic() {

            var data = google.visualization.arrayToDataTable(res);

            var options = {
              title: 'Top 5 Requests',
              chartArea: {width: '50%'},
              hAxis: {
                title: 'Sessions',
                minValue: 0
              },
              vAxis: {
                title: 'Request'
              },
              'tooltip' : {
                trigger: 'none'
              }
            };

            var chart = new google.visualization.BarChart(document.getElementById('chart_actions'));

            chart.draw(data, options);
          }
    })

  }


  fetchAnalyticsData(){
    var self = this;
    axios.get(self.state.analyticsURL).then(res=>{
      // console.log('analytics', res.data);
      this.setState({
        'results': res.data
      })
      this.shapeMapData();


    }).catch(err=>{
      throw err;
    })

  }

  fetchRealtimeUsers(){
    axios.get(this.state.realtimeURL).then(response=>{
      let users = parseInt(response.data.totalsForAllResults['rt:activeUsers']);
      this.setState({
        activeUsers: users
      });
      //creates data for Chart, max length is 10
      this.state.activeUsersHistory.push(users)
      if (this.state.activeUsersHistory.length > 10) {
        this.state.activeUsersHistory.shift();
      }
      this.props.sendChartData(this.state.activeUsersHistory);

    }).catch(err=>{
      throw err;
    })
  }

  shapeMapData(){
    let res =[]
    let arr = this.state.results.rows;
    for (var i = 0; i < arr.length; i++) {
      let long = parseFloat(arr[i][3]);
      let lat = parseFloat(arr[i][4]);
      let obj ={'name': arr[i][2]+', '+arr[i][1],'coordinates':[lat,long],'users': arr[i][7] };
      res.push(obj);
    }
    this.setState({
      'mapData': res
    });
    this.props.sendMapData(this.state.mapData);
  }



  componentDidMount(){
    var self = this;
    this.fetchAnalyticsData();
    this.fetchRealtimeUsers();
    this.drawPages();
    this.drawActions();
    this.timer =setInterval(function(){
      self.setState({
        lastActiveUsers: self.state.activeUsers
      })
      self.fetchRealtimeUsers();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.props.sendMapData([]);
  }

  render() {
    return (
      <section className="margin0Auto padding20 centerText mG-back">
        <div style={{width:'100%', clear:'both'}}>
          <img src="/static/img/mygene-text.png" width="300px" className="margin20"/>
          <button style={{position:'absolute', right:'20px'}} className='btn btn-blue' onClick={this.fetchAnalyticsData}>Refresh</button>
        </div>
        <div className="activeUsersBoxTest margin20 flex" style={{width:'50%', margin:'auto'}}>
          <div style={{flex:1}}>
            <h2 className="whiteText">Active Users Right Now</h2>
            <CountUp  className="whiteText activeUsers-MyGene"
                        start={this.state.lastActiveUsers}
                        end={this.state.activeUsers}
                        duration={3}
                        separator=","/>
          </div>
          <Chart/>
        </div>
        <br/>

        <div id='charts' style={{display:'flex'}}>
          <div id="chart_pages" style={{flex:1}}></div>
          <div id="chart_actions" style={{flex:1}}></div>
        </div>
        <br></br>
        <Map/>

      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    //will make the user object from redux store available as props.user to this component
    user : state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sendMapData: (value)=>{
      const action = {type: "UPDATE-MAP", payload: value};
      dispatch(action);
    },
    sendChartData: (value)=>{
      const action = {type: "UPDATE-CHART", payload: value};
      dispatch(action);
    }
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(MyGene)
