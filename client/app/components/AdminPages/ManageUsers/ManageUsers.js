import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import { getUsers } from '../../../utils/AccountAPI';

import Loading from '../../App/Loading';

class ManageUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: '',
      users: [],
      isLoading: true
    }
  }
  
  componentDidMount() {
    getUsers()
    .then(json => {
      if (json.success) {
        this.setState({
          users: json.users,
          isLoading: false
        });
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }

  editUser(e, id) {
    e.preventDefault();

    this.props.history.push(`/edit-user/${id}`);
  }

  render() {
    const { users, msg, isLoading } = this.state;
    return (
      <>
        {isLoading && (
          <Loading/>
        )}
        <h2>Manage users</h2>
        <br/>
        <table className="table">
          <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td><img src={user.businessCard} alt="user.username"/></td>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>
              <button 
              className="btn btn-primary"
              onClick={e => this.editUser(e, user._id)}>Edit</button>
              {/* <button 
              className="btn btn-danger"
              onClick={e => this.removeUser(e, user.username, user.email)}>Remove</button> */}
            </td>
          </tr>
        ))}
          </tbody>
        </table>
        {msg && (
          <div>{msg}</div>
        )}
        <Link 
        className="btn btn-primary btn-lg"
        to='/create-user'>
          Create New User
        </Link>
      </>
    )
  }
}

export default withRouter(ManageUsers);