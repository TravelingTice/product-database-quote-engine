import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import { getVendors } from '../../../utils/VendorAPI';

import Loading from '../../App/Loading';

class ManageVendors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: '',
      vendors: [],
      isLoading: true
    }
  }
  componentDidMount() {
    getVendors()
    .then(json => {
      if (json.success) {
        this.setState({
          vendors: json.vendors,
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

  editVendor(e, _id) {
    e.preventDefault();
    this.props.history.push(`/edit-vendor/${_id}`);
  }

  render() {
    const { vendors, msg, isLoading } = this.state;
    return (
      <>
        {isLoading && (
          <Loading/>
        )}
        <h2>Manage vendors</h2>
        <br/>
        <table className="table">
          <tbody>
        {vendors.map(vendor => (
          <tr key={vendor._id}>
            <td><img src={vendor.nameCard} alt={vendor.name}/></td>
            <td>{vendor.name}</td>
            <td>{vendor.email}</td>
            <td>
              <button 
              className="btn btn-info"
              onClick={e => this.editVendor(e, vendor._id)}>Edit</button>
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
        to='/create-vendor'>
          Create New Vendor
        </Link>
      </>
    )
  }
}

export default withRouter(ManageVendors);