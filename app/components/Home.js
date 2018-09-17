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
      views:['MyGene','MyVariant','MyChem','BioThings'],
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
      case '3':
          this.setState({
            display: 'MyChem'
          })
        break;
      case '4':
          this.setState({
            display: 'BioThings'
          })
        break;
      default:
        this.setState({
          display: ''
        })
    }
    // console.log(this.state.display)
  }

  componentDidMount(){
    var self = this;
    document.onkeypress = function (e) {
      e = e || window.event;
      // console.log('Key Pressed', e.key);
      self.handleKeyPressed(e.key);
    };

    var timer =setInterval(function(){
      self.rotateView();
    }, 120000);
  }

  render() {
    return (
      <section className="margin0Auto" >
        {!this.state.display &&
          <nav className="toggleNav">
              <Link onClick={()=>{this.handleKeyPressed('')}} className="bg-white" to='#'>Home</Link>
              <Link onClick={()=>{this.handleKeyPressed('1')}} className="mG whiteText" style={{margin:'3px'}} to='#'>MyGene (key 1)</Link>
              <Link onClick={()=>{this.handleKeyPressed('2')}} className="mV whiteText" style={{margin:'3px'}} to='#'>MyVariant (key 2)</Link>
              <Link onClick={()=>{this.handleKeyPressed('3')}} className="mC whiteText" style={{margin:'3px'}} to='#'>MyChem (key 3)</Link>
              <Link onClick={()=>{this.handleKeyPressed('4')}} className="mB whiteText" style={{margin:'3px'}} to='#'>BioThings (key 4)</Link>
          </nav>
        }

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
