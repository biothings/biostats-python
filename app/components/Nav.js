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
        <nav className="header">
          <Link className="logo" to="/">
            BioStats
          </Link>

        </nav>
      </header>
    );
  }
}
