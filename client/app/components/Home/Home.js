import React, { Component } from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div>
        <h2>Home</h2>
        <Link className="btn btn-danger" to='/new'>New</Link>
        <br/>
        <br/>
        <br/>
        <Link className="btn btn-danger" to='/my-quotes'>Existing</Link>
        <br/>
        <br/>
      </div>
    );
  }
}

export default Home;
