import React, { Component } from 'react';

import DataInput from '../UtilComps/DataInput';

import Loading from '../App/Loading';

import CountryDropDown from '../UtilComps/CountryDropDown';
import ImageSelect from '../UtilComps/ImageSelect';
import Prompt from '../UtilComps/Prompt';
import TextArea from '../UtilComps/TextArea';

import { withRouter } from 'react-router-dom';

import { getCurrentUser } from '../../utils/AccountAPI';
import { createCustomer, updateCustomer, removeCustomer, getCustomerByID } from '../../utils/CustomerAPI';
import { getFromStorage } from '../../utils/storage';

class CustomerInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: '',
      name: '',
      company: '',
      email: '',
      phone: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      businessCard: null,
      businessCardPreview: null,
      notes: '',
      user: '',
      msg: '',
      isEdit: false,
      isPanelOpen: false,
      isLoading: true
    }

    this.onChange = this.onChange.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);
    this.update = this.update.bind(this);
    this.create = this.create.bind(this);
    this.remove = this.remove.bind(this);

    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);
  }

  componentDidMount() {
    // check if customer has been passed as prop
    if (this.props.id) {
      // api to get customer and set in state
      getCustomerByID(this.props.id).then(json => {
        if (json.success) {
          this.setState({
            ...json.customer,
            businessCardPreview: json.customer.businessCard,
            isEdit: true,
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
      // get current user
      getCurrentUser().then(json => {
        if (json.success) {
          this.setState({
            user: json.user,
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
        businessCardPreview: reader.result,
        businessCard: currentFile
      })
    }, false);
    reader.readAsDataURL(currentFile);
  }

  update(e) {
    // display loading panel
    this.setState({ isLoading: true });

    const { _id, name, company, email, phone, street1, street2, city, state, postcode, country, notes, businessCard, user } = this.state;
    const { isInQuoteProcess } = this.props;

    e.preventDefault();
    // Save item to the database
    const data = new FormData();
    data.append('_id', _id);
    data.append('name', name);
    data.append('company', company);
    data.append('email', email);
    data.append('phone', phone);
    data.append('street1', street1);
    data.append('street2', street2);
    data.append('city', city);
    data.append('postcode', postcode);
    data.append('state', state);
    data.append('country', country);
    // check if file is in input of business card
    if (businessCard instanceof File) {
      data.append('businessCard', businessCard);
    }
    data.append('notes', notes);
    data.append('user', user);
    updateCustomer(data)
    .then(json => {
      // check if customer is created in quote creating process
      if (isInQuoteProcess) {
        // then we need to redirect to executable page with the right data
        const quoteID = getFromStorage('current_quote').id;
        this.props.history.push(`/quote-summary?id=${quoteID}&name=${name}`);
      } else {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }

  create(e) {
    // display loading panel
    this.setState({ isLoading: true });

    const { name, company, email, phone, street1, street2, city, state, postcode, country, businessCard, notes, user } = this.state;

    e.preventDefault();
    // Save item to the database
    const data = new FormData();
    data.append('name', name);
    data.append('company', company);
    data.append('email', email);
    data.append('phone', phone);
    data.append('street1', street1);
    data.append('street2', street2);
    data.append('city', city);
    data.append('state', state);
    data.append('postcode', postcode);
    data.append('country', country);
    // check if file is in input of business card
    if (businessCard instanceof File) {
      data.append('businessCard', businessCard);
    }
    data.append('notes', notes);
    data.append('user', user);

    // Save customer in database
    createCustomer(data)
    .then(json => {
      if (json.success) {
        // check if customer is created in quote creating process
        if (this.props.isInQuoteProcess) {
          // then we need to redirect to executable page with the right data
          const quoteID = getFromStorage('current_quote').id;
          this.props.history.push(`/quote-summary?id=${quoteID}&name=${name}`);
        } else {
          this.props.history.push('/manage-customers');
        }
      } else {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }

  remove(e) {
    // display loading panel
    this.setState({ isLoading: true });

    e.preventDefault();

    const { _id } = this.state;

    removeCustomer(_id).then(json => {
      if (json.success) {
        this.props.history.push('/manage-customers');
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }

  onOpenPanel(e) {
    e.preventDefault();

    this.setState({
      isPanelOpen: true
    });
  }

  onClosePanel(e) {
    e.preventDefault();

    if (e.target.classList.value === 'prompt-container' || e.target.classList.value === 'btn btn-danger back-btn') {
      this.setState({
        isPanelOpen: false
      });
    }
  }

  render() {
    const { name, company, email, phone, street1, street2, city, state, postcode, country, notes, businessCardPreview , msg, isPanelOpen, isEdit, isLoading } = this.state;
    const { isInQuoteProcess } = this.props;

    return (
      <div>
        {isLoading && (
          <Loading/>
        )}

        {msg && (
          <p className="alert alert-success">{msg}</p>
        )}

        {!isEdit ? (
          <h2>Add Customer</h2>
        ):(
          <h2>Edit {name}</h2>
        )}

        <form className="data-entry-form">

          <DataInput
          required={true}
          text="Customer name"
          id="name1"
          placeholder="Enter name"
          value={name}
          onChange={this.onChange}
          name="name"/>

          <DataInput
          text="Company"
          id="company1"
          placeholder="Enter company name"
          value={company}
          onChange={this.onChange}
          name="company"/>

          <DataInput
          required={true}
          text="Email"
          id="email1"
          placeholder="Enter client email"
          value={email}
          onChange={this.onChange}
          name="email"/>

          <DataInput
          text="Phone"
          id="phone1"
          placeholder="Enter client phone"
          value={phone}
          onChange={this.onChange}
          name="phone"/>

          <div className="address-input">
            <h3>Address</h3>

            <DataInput

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
            text="City / Town"
            id="city1"
            placeholder="city"
            value={city}
            onChange={this.onChange}
            name="city"/>

            <DataInput
            text="State / Province / Region"
            id="state1"
            placeholder="state / province / region"
            value={state}
            onChange={this.onChange}
            name="state"/>

            <DataInput
            text="Zip / Postal Code"
            id="postcode1"
            placeholder="zip or postal code"
            value={postcode}
            onChange={this.onChange}
            name="postcode"/>

            <CountryDropDown
            value={country}
            onChange={this.onChange}/>

          </div>
          {/* File input */}
          <ImageSelect
          onImageSelect={this.onImageSelect}
          preview={businessCardPreview}
          title="Upload Business Card"/>

          <TextArea
          text="Notes"
          id="notes1"
          placeholder="Enter notes"
          value={notes}
          onChange={this.onChange}
          name="notes"/>

          {/* prompt for when item gets deleted */}
          {isPanelOpen && (
            <Prompt
            text={'Are you sure you want to delete ' +  name}
            onBack={this.onClosePanel}
            onConfirm={this.remove}
            />
          )}

          {/* To make the difference between new item and item that is being edited */}
          <div className="footer-buttons">
            {isEdit ? (
              <>

                <button 
                className="btn btn-primary"
                onClick={e => this.update(e)}>Update</button>

                {!isInQuoteProcess && (
                  <button 
                  className="btn btn-danger"
                  onClick={e => this.onOpenPanel(e)}>Delete</button>
                )}


              </>
            ):(
              <button 
              className="btn btn-primary"
              onClick={e => this.create(e)}>Add</button>
            )}
            <button 
            className="btn btn-default"
            onClick={e => this.props.history.push('/manage-customers')}>Back</button>
          </div>
        </form>
      </div>
    )
  }
}

export default withRouter(CustomerInput);