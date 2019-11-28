import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import { getUser } from '../../utils/AccountAPI';

import Loading from '../App/Loading';

class MyInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      isLoading: true,
      msg: ''
    }
  }

  componentDidMount() {
    // get all info from the user
    console.log(this.props.user);
    getUser(this.props.user).then(json => {
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      } else {
        this.setState({
          user: json.user,
          isLoading: false
        });
      }
    });
  }

  render() {
    const { user, isLoading, msg } = this.state;
    console.log(user);
    if (user !== null) {
      const street1 = user.street1 ? user.street1 + ', ' : '';
      const street2 = user.street2 ? user.street2 + ', ' : '';
      const city = user.city ? user.city + ', ' : '';
      const postcode = user.postcode ? user.postcode + ', ' : '';
      const state = user.state ? user.state + ', ' : '';
      const country = user.country ? user.country : '';
      const address = street1 + street2 + city + postcode + state + country;
      const { businessCard, email, username, role, phone } = user;
      return (
        <>
          <h2>My Info</h2>
          {isLoading && (
            <Loading/>
          )}
          {msg && (
            <p className="alert alert-danger">
              {msg}
            </p>
          )}
  
          <div className="my-info">
            <img src={businessCard} alt={username}/>
            <table className="table">
              <tr>
                <td>Username: </td>
                <td>{username}</td>
              </tr>
              <tr>
                <td>Email: </td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>Role: </td>
                <td>{role}</td>
              </tr>
              <tr>
                <td>Phone: </td>
                <td>{phone}</td>
              </tr>
              <tr>
                <td>Address: </td>
                <td>{address}</td>
              </tr>
            </table>
            <button className="btn btn-info" disabled>Change password</button>
          </div>
        </>
      );
    }
  }
}

export default withRouter(MyInfo);