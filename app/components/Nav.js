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
          <Link className="logo text-light no-decoration" to="/">
            <b>BioThings</b> <span className="text-muted">Stats</span>
          </Link>
          <span className="navbar-text text-muted">
            Analytics data from the last 30 days
          </span>
        </nav>
      </header>
    );
  }
}
