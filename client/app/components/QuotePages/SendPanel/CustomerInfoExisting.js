import React, { Component } from 'react';

import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

import { getCustomersFromUser } from '../../../utils/CustomerAPI';

import Loading from '../../App/Loading';

class CustomerInfoExisting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      query: '',
      msg: '',
      isLoading: true
    }
    this.updateQuery = this.updateQuery.bind(this);
  }

  updateQuery(query) {
    this.setState({
      query
    });
  }

  componentDidMount() {
    getCustomersFromUser(this.props.user).then(json => {
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        })
      } else {
        this.setState({
          customers: json.customers,
          isLoading: false
        });
      }
    });
  }

  render() {
    const { customers, msg, query, isLoading } = this.state;
    const { selectedCustomer, onSelectCustomer } = this.props;

    let showingCustomers;
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i');
      showingCustomers = customers.filter(customer => match.test(customer.name))
    } else {
      showingCustomers = customers;
    }
    showingCustomers.sort(sortBy('name'));
    showingCustomers = showingCustomers.filter((c, i) => i < 5);

    return (
      <>
      {isLoading && (
        <Loading/>
      )}
      {msg && (
        <p className="alert alert-danger">{msg}</p>
      )}
      <div>
        <input 
        type="text"
        value={query}
        onChange={e => this.updateQuery(e.target.value)}/>

        <ul className="customer-results">
          {showingCustomers.map((customer, i) => (
            <li
            className={selectedCustomer !== null && selectedCustomer.name === customer.name ? 'light-grey-darker' : ''}
            key={i}
            onClick={() => onSelectCustomer(customer)}>
              {customer.name}
            </li>
          ))}
        </ul>
      </div>
      </>
    )
  }
}

export default CustomerInfoExisting;