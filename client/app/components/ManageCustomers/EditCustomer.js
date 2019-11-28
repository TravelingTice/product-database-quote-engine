import React, { Component } from 'react';
import { getCustomerByID } from '../../utils/CustomerAPI';
import CustomerInput from './CustomerInput';

class EditCustomer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      msg: ''
    }
  }

  componentDidMount() {
    // because of extra render method in switch for customer-2 url, we need the props of the props to access the name
    let params;
    if (this.props.isInQuoteProcess) {
      params = this.props.props.match.params
    } else {
      params = this.props.match.params;
    }
    this.setState({ id: params.id });
  }

  render() {
    const { id, msg, isLoading } = this.state;
    return (
      <>
        {msg && (
          <p className="alert alert-danger">{msg}</p>
        )}
        {id !== null && (
          <CustomerInput
          id={id}
          isInQuoteProcess={this.props.isInQuoteProcess}/>
        )}
    </>
    )
  }
}

export default EditCustomer;