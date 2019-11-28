import React, { Component } from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router-dom';

class EditorHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <div>
        <h2>Home</h2>
        <Link className="btn btn-danger" to='/add-item'>Create new item</Link>
        <br/>
        <br/>
        <br/>
        <Link className="btn btn-danger" to='/select-item'>Edit existing</Link>
        <br/>
        <br/>
      </div>
    );
  }
}

export default EditorHome;
