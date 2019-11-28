import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import CustomerInfoExisting from './CustomerInfoExisting';
import { getFromStorage } from '../../../utils/storage';

class SendQuote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: '',
      selectedCustomer: null
    }
    this.onSelectCustomer = this.onSelectCustomer.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  onSelectCustomer(customer) {
    this.setState({
      selectedCustomer: customer
    });
  }

  onNext(e) {
    e.preventDefault();
    const { selectedCustomer } = this.state;

    const quoteID = getFromStorage('current_quote').id;
    // check if customer is selected
    if (selectedCustomer !== null) {
      // send data to new url, with id and customer name
      this.props.history.push(`/quote-summary?id=${quoteID}&name=${selectedCustomer.name}`);
    } else {
      // display error message
      this.setState({
        msg: 'Please select a customer'
      });
    }
  }

  render() {
    const { msg, selectedCustomer } = this.state;
    return (
      <div className="send-quote-panel prompt">
        <div className="header">
          <h3>Customer information</h3>
        </div>
        <ul className="customer-info-nav">
          <li key={1} className="light-grey">Existing</li>
          <li key={2}
          className="btn btn-danger">
            <Link 
            to="/create-customer-2"
            className="white-text">New</Link>
          </li>
        </ul>
        <div className="customer-info-container light-grey">
          <CustomerInfoExisting
          user={this.props.user}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={this.onSelectCustomer}/>
        </div>
        {msg && (
          <p className="alert alert-danger">{msg}</p>
        )}
        <div className="panel-footer">
          <button 
          className="btn btn-danger"
          onClick={e => this.onNext(e)}>
            Next
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(SendQuote);