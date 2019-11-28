import React, { Component } from 'react';
import UserInput from './UserInput';

class EditUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      msg: ''
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.setState({
      id: params.id
    })
  }

  render() {
    const { id, msg } = this.state;
    return (
      <div>
      {msg && (
        <p className="alert alert-danger">{msg}</p>
      )}
      {id && (
        <UserInput
        id={id}/>
      )}
      </div>
    )
  }
}

export default EditUser;