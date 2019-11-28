import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

class MenuItem extends Component {
  constructor(props) {
    super(props);
  }

  onNav(to) {
    this.props.history.push(to);
  }

  render() {
    const { to, text } = this.props;
    return (
      <li className="nav-item">

        <a 
        className="nav-link" 
        onClick={() => this.onNav(to)}
        data-toggle="collapse"
        data-target=".navbar-collapse.show">

          {text}

        </a>

      </li>

    )
  }
}

export default withRouter(MenuItem);