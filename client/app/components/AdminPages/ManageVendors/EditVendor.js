import React, { Component } from 'react';
import { getVendor } from '../../../utils/VendorAPI';

import VendorInput from './VendorInput';

class EditVendor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vendor: null,
      msg: ''
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    getVendor(params.vendorID).then(json => {
      if (!json.success) {
        this.setState({
          msg: json.message
        });
      } else {
        this.setState({
          vendor: json.vendor
        });
      }
    });
  }

  render() {
    const { vendor, msg } = this.state;
    return (
      <>
      {msg && (
        <p className="alert alert-danger">{msg}</p>
      )}
      {vendor && (
        <VendorInput
        id={vendor._id}/>
      )}
      </>
    )
  }
}

export default EditVendor;