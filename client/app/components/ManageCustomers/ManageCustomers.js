import React, { Component } from 'react';

import Loading from '../App/Loading';

import { getCustomersFromUser } from '../../utils/CustomerAPI';

import { getCurrentUser } from '../../utils/AccountAPI';

import { Link } from 'react-router-dom';

class ManageCustomers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      msg: '',
      user: '',
      isLoading: true
    }
  }

  componentDidMount() {
    getCurrentUser().then(json => {
      if (json.success) {
        getCustomersFromUser(json.user)
        .then(json => {
          if (json.success) {
            this.setState({
              customers: json.customers,
              isLoading: false
            });
          } else {
            this.setState({
              msg: json.message,
              isLoading: false
            });
          }
        });
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }
  
  render() {
    const { customers, msg, isLoading } = this.state;
    return (
      <>
        {isLoading && (
          <Loading/>
        )}
        {msg && (
          <p className="alert alert-warning">{msg}</p>
        )}
        <h2>Customers</h2>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Company</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer._id}>
                <td><img src={customer.businessCard} alt={customer.name}/></td>
                <td>{customer.name}</td>
                <td>{customer.company}</td>
                <td><Link
                to={`customer/${customer._id}`}
                className="btn btn-primary">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to='/create-customer' className="btn btn-danger">Add Customer</Link>
      </>
    )
  }
}

export default ManageCustomers;