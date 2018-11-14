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
        sessionsURL:'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgICAgICACgw',
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
        totalSessions: 0,
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
      res.push(['Endpoint', 'Sessions']);
      for (var i = 0; i < arr.length; i++) {
        res.push([arr[i][0],parseFloat(arr[i][1])]);
      }

      google.charts.load('current', {packages: ['corechart', 'bar']});
      google.charts.setOnLoadCallback(drawBasic);

      function drawBasic() {

            var data = google.visualization.arrayToDataTable(res);

            var options = {
              legend: {position: 'none'},
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
                isHtml: true
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
      res.push(['Action', 'Sessions']);
      for (var i = 0; i < arr.length; i++) {
        res.push([arr[i][0],parseFloat(arr[i][1])]);
      }

      google.charts.load('current', {packages: ['corechart', 'bar']});
      google.charts.setOnLoadCallback(drawBasic);

      function drawBasic() {

            var data = google.visualization.arrayToDataTable(res);

            var options = {
              legend: {position: 'none'},
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
                isHtml: true
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
      this.setState({
        'results': res.data
      })
      this.shapeMapData();


    }).catch(err=>{
      throw err;
    })

    axios.get(self.state.sessionsURL).then(res=>{
      let users = parseInt(res.data['totalsForAllResults']['ga:sessions']);
      this.props.pushReqData(users);
      this.setState({
        'totalSessions': users
      })

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
      this.props.updateHistory(users);
      this.props.sendChartData(this.props.mgHistory);

    }).catch(err=>{
      throw err;
    })
  }


  shapeMapData(){
    let res =[]
    let arr = this.state.results.rows;
    for (var i = 0; i < arr.length; i++) {
      let long = parseFloat(arr[i][2]);
      let lat = parseFloat(arr[i][3]);
      let obj ={'api':'MyGene','name': arr[i][1]+', '+arr[i][0],'coordinates':[lat,long],'users': arr[i][4] };
      res.push(obj);
    }
    this.setState({
      'mapData': res
    });
    this.props.sendMapData(this.state.mapData);
    this.props.pushMapData(this.state.mapData);
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
      <section className="margin0Auto padding20 centerText mG-back2">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <img src="/static/img/screw.png" className="screwTopRight"/>
              <img src="/static/img/screw.png" className="screwTopLeft"/>
              <img src="/static/img/screw.png" className="screwBottomRight"/>
              <img src="/static/img/screw.png" className="screwBottomLeft"/>
                <div className=" row activeUsersBoxTest">
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <img src="/static/img/mygene-text.png" width="90%" className="margin20 dropShadow"/>
                    <h4 className="whiteText">Active Users Right Now</h4>
                    <CountUp className="whiteText activeUsers-MyGene"
                                start={this.state.lastActiveUsers}
                                end={this.state.activeUsers}
                                duration={3}
                                separator=","/>
                  </div>
                  <Chart panel="MyGene" className="col-sm-12 col-md-4 col-lg-4"/>
                  <div className="col-sm-12 col-md-4 col-lg-4 text-center">
                    <button style={{'marginBottom':'10px'}} className='btn btn-outline-dark refreshBtn' onClick={this.fetchAnalyticsData}>Refresh</button>
                    <h1 className="text-muted whiteGlass font-weight-bold">
                      <CountUp  className="text-muted"
                                start={0}
                                end={this.state.totalSessions}
                                duration={3}
                                separator=","/>
                    </h1>
                    <h5 className='text-light'>
                      Requests in the Last 30 Days
                    </h5>
                  </div>
                </div>
            </div>
            <div id='charts' className='activeUsersBoxTest col-sm-12 col-md-12 col-lg-12' style={{display:'flex', padding:5}}>
              <img src="/static/img/screw.png" className="screwTopRight"/>
              <img src="/static/img/screw.png" className="screwTopLeft"/>
              <img src="/static/img/screw.png" className="screwBottomRight"/>
              <img src="/static/img/screw.png" className="screwBottomLeft"/>
              <div id="chart_pages" style={{flex:1}}></div>
              <div id="chart_actions" style={{flex:1}}></div>
            </div>
            <div className='activeUsersBoxTest col-sm-12 col-md-12 col-lg-12 mapContainer'>
              <img src="/static/img/screw.png" className="screwTopRight"/>
              <img src="/static/img/screw.png" className="screwTopLeft"/>
              <img src="/static/img/screw.png" className="screwBottomRight"/>
              <img src="/static/img/screw.png" className="screwBottomLeft"/>
              <Map color='#58b4ff' api='MG'/>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    //will make the user object from redux store available as props.user to this component
    user : state.user,
    mgHistory: state.mgHistory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sendMapData: (value)=>{
      const action = {type: "UPDATE-MAP", payload: value};
      dispatch(action);
    },
    sendMap100Users: (value)=>{
      const action = {type: "UPDATE-MAP-100", payload: value};
      dispatch(action);
    },
    sendChartData: (value)=>{
      const action = {type: "UPDATE-CHART", payload: value};
      dispatch(action);
    },
    updateHistory: (value)=>{
      const action = {type: "PUSH-TO-MGHISTORY", payload: value};
      dispatch(action);
    },
    pushReqData: (value)=>{
      const action = {type: "MG-REQUESTS", payload: value};
      dispatch(action);
    },
    pushMapData: (value)=>{
      const action = {type: "MC-MAP", payload: value};
      dispatch(action);
    }
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(MyGene)
