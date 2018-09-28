import React from 'react';
import {Link} from 'react-router-dom';

export default class Nav extends React.Component {

  constructor(props) {
    super(props);
    this.state={

    }
    this.myFunc = this.myFunc.bind(this);
  }

  myFunc(arg){

  }

  render() {
    return (
      <header>
        <nav className="navbar navbar-dark bg-dark">
          <Link className="logo text-light" to="/">
            BioStats
          </Link>
          <span className="navbar-text text-muted">
            BioThings Analytics & UpTime API
          </span>
        </nav>
      </header>
    );
  }
}
