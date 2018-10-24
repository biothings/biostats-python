import React, { PropTypes } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux'
import axios from 'axios';
import MyVariant from './MyVariant';
import MyChem from './MyChem';
import BioThings from './BioThings';
import Welcome from './Welcome';
import MyGene from './MyGene';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      test: 'new value',
      apiRes: '',
      display: '',
      views:['MyGene','MyVariant','BioThings'],
      startingViewIndex: 0
    }
    this.testApi = this.testApi.bind(this);
    this.handleKeyPressed = this.handleKeyPressed.bind(this);
    this.rotateView = this.rotateView.bind(this);
  }

  rotateView(){
    if(this.state.startingViewIndex + 1 >= this.state.views.length){
      this.setState({
        'startingViewIndex': 0,
        'display': this.state.views[this.state.startingViewIndex]
      });
    }else{
      this.setState({
        'startingViewIndex': this.state.startingViewIndex + 1,
        'display': this.state.views[this.state.startingViewIndex]
      });
    }
  }

  testApi(){
    axios.get('/api/test').then(res=>{
      // console.log("response",res);
      this.setState({
        apiRes: res.data.test
      })
    }).catch(err=>{
      throw(err);
    })
  }

  handleKeyPressed(key){
    switch (key) {
      case '1':
          this.setState({
            display: 'MyGene'
          })
        break;
      case '2':
          this.setState({
            display: 'MyVariant'
          })
        break;
      // case '3':
      //     this.setState({
      //       display: 'MyChem'
      //     })
      //   break;
      case '3':
          this.setState({
            display: 'BioThings'
          })
        break;
      default:
        this.setState({
          display: ''
        })
    }
  }

  componentDidMount(){
    var self = this;
    document.onkeypress = function (e) {
      e = e || window.event;
      self.handleKeyPressed(e.key);
    };

    setTimeout(function(){
      self.setState({
        display: 'MyGene'
      })
    },5000);

    var timer =setInterval(function(){
      self.rotateView();
    }, 300000);
  }

  render() {
    return (
      <section className="margin0Auto" >
        {this.state.display === 'MyGene' && <MyGene/>}
        {this.state.display === 'MyVariant' && <MyVariant/>}
        {this.state.display === 'MyChem' && <MyChem/>}
        {this.state.display === 'BioThings' && <BioThings/>}
        {!this.state.display && <Welcome/>}
      </section>
    );
  }
}



function mapStateToProps(state) {
  return {
    user : state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onTestClick: (value)=>{
      const action = {type: "TEST", payload: value};
      dispatch(action);
    }
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(Home)
