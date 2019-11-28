import React, { Component } from 'react';

import DataInput from '../../UtilComps/DataInput';
import CountryDropDown from '../../UtilComps/CountryDropDown';

import { withRouter } from 'react-router-dom';

import { getVendor } from '../../../utils/VendorAPI';
import { createVendor, updateVendor, deleteVendor } from '../../../utils/VendorAPI';
import ImageSelect from '../../UtilComps/ImageSelect';
import TextArea from '../../UtilComps/TextArea';
import Prompt from '../../UtilComps/Prompt';
import Loading from '../../App/Loading';

class VendorInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: '',
      name: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      contactPerson: '',
      email: '',
      phone: '',
      nameCard: null,
      nameCardPreview: null,
      notes: '',
      isEdit: false,
      msg: '',
      isPrompt: false,
      isLoading: true
    }

    this.onChange = this.onChange.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);
    this.openPrompt = this.openPrompt.bind(this);
    this.closePrompt = this.closePrompt.bind(this);

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    // check if vendor has been passed as prop, which means this is a vendor that will be edited
    if (this.props.id) {
      getVendor(this.props.id).then(json => {
        if (!json.success) {
          this.setState({
            msg: json.message,
            isLoading: false
          });
        } else {
          this.setState({
            ...json.vendor,
            nameCardPreview: json.vendor.nameCard,
            isEdit: true,
            isLoading: false
          });
        }
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  onChange(property, value) {
    const keys = Object.keys(this.state);
    keys.forEach(keyName => {
      if (keyName === property) {
        this.setState({
          [keyName]: value
        });
      }
    });
  }

  onImageSelect(e) {
    const currentFile = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        nameCardPreview: reader.result,
        nameCard: currentFile,
        isNameCardUpdated: true
      })
    }, false);
    reader.readAsDataURL(currentFile);
  }
  
  create(e) {
    const { name, street1, street2, city, state, postcode, country, contactPerson, email, phone, nameCard, notes } = this.state;
    e.preventDefault();
    
    this.setState({ isLoading: true });
    
    // create vendor data object
    const data = new FormData();
    data.append('name', name);
    data.append('contactPerson', contactPerson);
    data.append('email', email);
    data.append('phone', phone);
    data.append('street1', street1);
    data.append('street2', street2);
    data.append('city', city);
    data.append('state', state);
    data.append('postcode', postcode);
    data.append('country', country);
    // check if namecard has been inserted
    if (nameCard instanceof File) {
      data.append('nameCard', nameCard);
    }
    data.append('notes', notes);

    createVendor(data)
    .then(json => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      } else {
        this.props.history.push('/manage-vendors');
      }
    });
  }

  update(e) {
    const { _id, name, street1, street2, city, state, postcode, country, contactPerson, email, phone, nameCard, notes } = this.state;
    e.preventDefault();

    this.setState({ isLoading: true });

    // Create 2 new vendor objects (1 with photo, 1 without)
    const data = new FormData();
    data.append('_id', _id);
    data.append('name', name);
    data.append('contactPerson', contactPerson);
    data.append('email', email);
    data.append('phone', phone);
    data.append('street1', street1);
    data.append('street2', street2);
    data.append('city', city);
    data.append('state', state);
    data.append('postcode', postcode);
    data.append('country', country);
    // check if namecard has been reselected (so the value is an instance of File)
    if (nameCard instanceof File) {
      data.append('nameCard', nameCard);
    }
    data.append('notes', notes);

    updateVendor(data).then(json => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.setState({
        msg: json.message,
        isLoading: false
      });
    });
  }
  
  remove(e) {
    e.preventDefault();
    
    this.setState({ isLoading: true });
    
    const id = this.state._id;
    deleteVendor(id).then(json => {
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      } else {
        this.props.history.push('/manage-vendors');
      }
    });
  }
  
  openPrompt() {
    this.setState({
      isPrompt: true
    });
  }
  
  closePrompt(e) {
    e.preventDefault();
    if (e.target.classList.value === 'prompt-container' || e.target.classList.value === 'btn btn-danger back-btn') {
      this.setState({
        isPrompt: false
      });
    }
  }

  render() {
    const { name, street1, street2, city, state, postcode, country, contactPerson, email, phone, nameCardPreview, notes, isEdit, msg, isPrompt, isLoading } = this.state;

    return (
      <>
        {isLoading && (
          <Loading/>
        )}

        {!isEdit ? (
          <h2>Create Vendor</h2>
        ):(
          <h2>Edit Vendor</h2>
        )}

        {msg && (
          <p className="alert alert-success">{msg}</p>
        )}
        
        <form className="data-entry-form">
          <DataInput
          required={true}
          text="Vendor name"
          id="name1"
          placeholder="Enter name"
          value={name}
          onChange={this.onChange}
          name="name"/>

          <DataInput
          text="Vendor contactperson"
          id="contactperson1"
          placeholder="Enter contactperson"
          value={contactPerson}
          onChange={this.onChange}
          name="contactPerson"/>

          <DataInput
          required={true}
          text="Email"
          id="email1"
          placeholder="Enter email"
          value={email}
          onChange={this.onChange}
          name="email"/>

          <DataInput
          text="Phone"
          id="phone1"
          placeholder="Enter phone"
          value={phone}
          onChange={this.onChange}
          name="phone"/>

          <div className="address-input">
            <h3>Address</h3>

            <DataInput
            required={true}
            text="Address line 1"
            id="street1"
            placeholder="Street address"
            value={street1}
            onChange={this.onChange}
            name="street1"/>

            <DataInput
            text="Address line 2"
            id="street2"
            placeholder="Apartment, suite, unit, building, floor, etc."
            value={street2}
            onChange={this.onChange}
            name="street2"/>

            <DataInput
            required={true}
            text="City / Town"
            id="city1"
            placeholder="city"
            value={city}
            onChange={this.onChange}
            name="city"/>

            <DataInput
            required={true}
            text="State / Province / Region"
            id="state1"
            placeholder="state / province / region"
            value={state}
            onChange={this.onChange}
            name="state"/>

            <DataInput
            required={true}
            text="Zip / Postal Code"
            id="postcode1"
            placeholder="zip or postal code"
            value={postcode}
            onChange={this.onChange}
            name="postcode"/>

            <CountryDropDown
            required={true}
            value={country}
            onChange={this.onChange}/>

          </div>

          {/* File input */}
          <ImageSelect
          onImageSelect={this.onImageSelect}
          preview={nameCardPreview}
          title="Upload Name Card"/>

          {/* Notes */}
          <TextArea
          text="Notes"
          id="notes1"
          placeholder="Enter notes"
          value={notes}
          onChange={this.onChange}
          name="notes"/>
        </form>

        <div className="footer-buttons">

          {isEdit && (
            <>
              <button 
              className="btn btn-primary"
              onClick={e => this.update(e)}>Update</button>
              <button 
              className="btn btn-danger"
              onClick={e => this.openPrompt(e)}>Delete</button>
            </>
          )}

          {!isEdit && (
            <button 
            className="btn btn-primary"
            onClick={e => this.create(e)}>Create vendor</button>
          )}
          <button 
            className="btn btn-default"
            onClick={() => this.props.history.push('/manage-vendors')}>Back</button>
        </div>

        {isPrompt && (
          <Prompt
          onBack={this.closePrompt}
          onConfirm={this.remove}
          text="Are you sure?"/>
        )}
      </>
    )
  }
}

export default withRouter(VendorInput);