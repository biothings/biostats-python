import React, { PropTypes } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import CountUp from 'react-countup';
import Chart from './Chart';
import Map from './Map';
import _ from 'lodash';


class BioThings extends React.Component {

  constructor(props) {
    super(props);
    this.state={
        'top100MG':'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgIDA8v-XCgw',
        'top100MV':'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgIDAiuSOCgw',
        'top100MC':'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgIDA0_SPCQw',
        sessionsURL:'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgICA2uOGCgw',
        analyticsURL : 'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgICAutGQCgw',
        rtMG:'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgIDAsbqFCgw',
        rtMV:'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgICgwteGCgw',
        rtMC:'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgIDAyN6VCgw',
        pagesURL:'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgIDAk4eHCgw',
        actionsURL:'https://gasuperproxy-1470690417190.appspot.com/query?id=ahxzfmdhc3VwZXJwcm94eS0xNDcwNjkwNDE3MTkwchULEghBcGlRdWVyeRiAgICAuqiOCgw',
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
        'top100results': []
    }
    this.fetchAnalyticsData = this.fetchAnalyticsData.bind(this);
    this.fetchRealtimeUsers = this.fetchRealtimeUsers.bind(this);
    this.shapeMapData = this.shapeMapData.bind(this);
    this.addComma = this.addComma.bind(this);
    this.getUniqueItemsInTopPages = this.getUniqueItemsInTopPages.bind(this);
    this.drawPages = this.drawPages.bind(this);
    this.drawActions = this.drawActions.bind(this);
    this.fetchTop100 = this.fetchTop100.bind(this);
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
      // console.log('pie res',response.data)
      res.push(['Action', 'Sessions']);
      for (var i = 0; i < arr.length; i++) {
        res.push([arr[i][0],parseFloat(arr[i][1])]);
      }

      // className.log('final arr', res)

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
      // console.log('analytics', res.data);
      this.setState({
        'results': res.data
      })
      this.shapeMapData();


    }).catch(err=>{
      throw err;
    })

    // axios.get(self.state.sessionsURL).then(res=>{
    //   let users = parseInt(res.data['totalsForAllResults']['ga:sessions']);
    //   this.setState({
    //     'totalSessions': users
    //   })
    //
    // }).catch(err=>{
    //   throw err;
    // })
    let total = this.props.mgReq + this.props.mcReq + this.props.mvReq;
    this.setState({
      'totalSessions': total
    })

  }

  fetchRealtimeUsers(){
    let self = this;
    let usersTotal = 0;
    axios.get(self.state.rtMG).then(response=>{
      let users = parseInt(response.data.totalsForAllResults['rt:activeUsers']);
      usersTotal = usersTotal + users;
      // --------------------------
      axios.get(self.state.rtMV).then(response=>{
        let users1 = parseInt(response.data.totalsForAllResults['rt:activeUsers']);
        usersTotal = usersTotal + users1;
        // --------------------------
        axios.get(self.state.rtMC).then(response=>{
          let users2 = parseInt(response.data.totalsForAllResults['rt:activeUsers']);
          usersTotal = usersTotal + users2;
          // --------------------------
          self.setState({
            activeUsers: usersTotal
          });
          // creates data for Chart, max length is 10
          self.state.activeUsersHistory.push(users)
          if (self.state.activeUsersHistory.length > 10) {
            self.state.activeUsersHistory.shift();
          }
          self.props.updateHistory(usersTotal);
          self.props.sendChartData(self.props.btHistory);
          // --------------------------
        }).catch(err=>{
          throw err;
        });
        // --------------------------
      }).catch(err=>{
        throw err;
      });
      // --------------------------
    }).catch(err=>{
      throw err;
    });
  }



  fetchTop100(){
    var self = this;
    let total = [];
    axios.get(self.state.top100MG).then(res=>{
      total = total.concat(res.data.rows)
      // ----------
      axios.get(self.state.top100MV).then(res=>{
        total = total.concat(res.data.rows)
        // ----------
        axios.get(self.state.top100MC).then(res=>{
          total = total.concat(res.data.rows)
          // ----------
          // console.log('should be 300', total.length)
          self.setState({
            'top100results': total
          })
          self.shape100Data();
          // ----------
        }).catch(err=>{
          throw err;
        })
        // ----------
      }).catch(err=>{
        throw err;
      })
      // ----------
    }).catch(err=>{
      throw err;
    })
  }



  shape100Data(){
    let res =[]
    let arr = this.state.top100results;
    for (var i = 0; i < arr.length; i++) {
      let long = parseFloat(arr[i][2]);
      let lat = parseFloat(arr[i][1]);
      let obj ={'name': arr[i][0],'coordinates':[long,lat],'users': arr[i][3] };
      res.push(obj);
    }
    // this.setState({
    //   'mapData': res
    // });
    this.props.sendMap100Users(res);
  }

  shapeMapData(){
    let res =[]

    res = this.props.mgMap.concat(this.props.mcMap).concat(this.props.mvMap);
    res = _.sortBy(res,function (obj) {
        return parseInt(obj.users, 10);
    });
    res = res.reverse();
    res = res.slice(0,10);
    this.setState({
      'mapData': res
    });
    this.props.sendMapData(this.state.mapData);
  }



  componentDidMount(){
    var self = this;
    this.fetchAnalyticsData();
    this.fetchRealtimeUsers();
    this.fetchTop100();
    // this.drawPages();
    // this.drawActions();
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
      <section className="margin0Auto padding20 centerText mB-back2">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <img src="/static/img/screw.png" className="screwTopRight"/>
              <img src="/static/img/screw.png" className="screwTopLeft"/>
              <img src="/static/img/screw.png" className="screwBottomRight"/>
              <img src="/static/img/screw.png" className="screwBottomLeft"/>
                <div className=" row activeUsersBoxTest">
                  <div className="col-sm-12 col-md-4 col-lg-4">
                    <img src="/static/img/biothings-text.png" width="300px" className="margin20 dropShadow"/>
                    <h4 className="whiteText">Active Users Right Now</h4>
                    <CountUp  className="whiteText activeUsers-BioThings"
                                start={this.state.lastActiveUsers}
                                end={this.state.activeUsers}
                                duration={3}
                                separator=","/>
                  </div>
                  <Chart panel="BioThings" className="col-sm-12 col-md-4 col-lg-4"/>
                  <div className="col-sm-12 col-md-4 col-lg-4 text-center">
                    <button style={{'marginBottom':'10px'}}  className='btn btn-outline-dark refreshBtn' onClick={this.fetchAnalyticsData}>Refresh</button>
                    <h1 className="text-muted whiteGlass font-weight-bold">
                      <CountUp  className="text-muted"
                                start={0}
                                end={this.state.totalSessions}
                                duration={3}
                                separator=","/>
                    </h1>
                    <h4 style={{color:'#b1b1b1'}}>
                      Requests in the Last 30 Days
                    </h4>
                  </div>
                </div>
            </div>
            {/* <div id='charts' className='activeUsersBoxTest col-sm-12 col-md-12 col-lg-12' style={{display:'flex'}}>
              <img src="/static/img/screw.png" className="screwTopRight"/>
              <img src="/static/img/screw.png" className="screwTopLeft"/>
              <img src="/static/img/screw.png" className="screwBottomRight"/>
              <img src="/static/img/screw.png" className="screwBottomLeft"/>
              <div id="chart_pages" style={{flex:1}}></div>
              <div id="chart_actions" style={{flex:1}}></div>
            </div> */}
            <div className='activeUsersBoxTest col-sm-12 col-md-12 col-lg-12 mapContainer'>
              <img src="/static/img/screw.png" className="screwTopRight"/>
              <img src="/static/img/screw.png" className="screwTopLeft"/>
              <img src="/static/img/screw.png" className="screwBottomRight"/>
              <img src="/static/img/screw.png" className="screwBottomLeft"/>
              <Map color='#FCCA52'/>
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
    mgHistory: state.mgHistory,
    mcHistory: state.mcHistory,
    mvHistory: state.mvHistory,
    btHistory: state.btHistory,
    mgReq : state.mgReq,
    mcReq : state.mcReq,
    mvReq : state.mvReq,
    mgMap : state.mgMap,
    mcMap : state.mcMap,
    mvMap : state.mvMap,
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
      const action = {type: "PUSH-TO-BTHISTORY", payload: value};
      dispatch(action);
    },
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(BioThings)
