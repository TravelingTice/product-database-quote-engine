import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import { signUp, removeUser, updateUser, getUserByID } from '../../../utils/AccountAPI';

import { sendSignUpEmail } from '../../../utils/EmailAPI';

import DataInput from '../../UtilComps/DataInput';
import ImageSelect from '../../UtilComps/ImageSelect';
import TextArea from '../../UtilComps/TextArea';
import RadioGroup from '../../UtilComps/RadioGroup';
import Prompt from '../../UtilComps/Prompt';
import CountryDropDown from '../../UtilComps/CountryDropDown';

import Loading from '../../App/Loading';

class UserInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Afghanistan',
      role: 'salesrep',
      businessCard: null,
      businessCardPreview: null,
      isBusinessCardUpdated: false,
      isEdit: false,
      notes: '',
      msg: '',
      isLoading: true
    }

    this.onChange = this.onChange.bind(this);
    this.create = this.create.bind(this);
    this.onRoleChange = this.onRoleChange.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);

    this.remove = this.remove.bind(this);
    this.openPrompt = this.openPrompt.bind(this);
    this.closePrompt = this.closePrompt.bind(this);
  }

  componentDidMount() {
    // if a user is passed as a prop, this is an edit of an existing person. Password gets edited using a different method
    if (this.props.id) {
      getUserByID(this.props.id).then(json => {
        if (!json.success) {
          this.setState({
            msg: json.message,
            isLoading: false
          });
        } else {
          this.setState({
            ...json.user,
            businessCardPreview: json.user.businessCard,
            isEdit: true,
            isLoading: false
          });
        }
      });
    } else {
      this.setState({
        isLoading: false
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

  onRoleChange(role) {
    this.setState({
      role
    });
  }

  onImageSelect(e) {
    const currentFile = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        businessCardPreview: reader.result,
        businessCard: currentFile,
        isBusinessCardUpdated: true
      });
    }, false);
    reader.readAsDataURL(currentFile);
  }

  create(e) {
    e.preventDefault();

    this.setState({ isLoading: true });

    const { username, password, email, phone, street1, street2, city, state, postcode, country, role, businessCard, notes } = this.state;

    const userData = new FormData();

    userData.append('username', username);
    userData.append('password', password);
    userData.append('email', email);
    userData.append('phone', phone);
    userData.append('street1', street1);
    userData.append('street2', street2);
    userData.append('city', city);
    userData.append('state', state);
    userData.append('postcode', postcode);
    userData.append('country', country);
    userData.append('role', role);
    // check if businesscard is selected, so is instance of file
    if (businessCard instanceof File) {
      userData.append('businessCard', businessCard);
    }
    userData.append('notes', notes);

    signUp(userData)
    .then(json => {
      if (json.success) {
        // send an email to this user

        // set unencrypted password for user for email sending
        json.user.password = json.password;
        sendSignUpEmail(json.user).then(json => {
          if (json.success) {
            this.props.history.push('/manage-users');
          } else {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            this.setState({
              msg: json.message,
              isLoading: false
            });
          }
        });
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

  update(e) {
    e.preventDefault();

    this.setState({ isLoading: true });

    const { _id, username, password, email, phone, street1, street2, city, state, postcode, country, role, businessCard, notes } = this.state;

    const userData = new FormData();

    userData.append('_id', _id);
    userData.append('username', username);
    userData.append('password', password);
    userData.append('email', email);
    userData.append('phone', phone);
    userData.append('street1', street1);
    userData.append('street2', street2);
    userData.append('city', city);
    userData.append('state', state);
    userData.append('postcode', postcode);
    userData.append('country', country);
    userData.append('role', role);
    // check if businesscard is updated (so a file is in place)
    if (businessCard instanceof File) {
      userData.append('businessCard', businessCard);
    }
    userData.append('notes', notes);

    updateUser(userData)
    .then(json => {
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

    const { username, email } = this.state;

    removeUser(username, email)
    .then(json => {
      if (json.success) {
        this.props.history.push('/manage-users');
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        });
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
    const { username, password, email, phone, street1, street2, city, state, postcode, country, role, businessCardPreview, notes, isEdit, msg, isPrompt, isLoading } = this.state;
    return (
      <>
        {isLoading && (
          <Loading/>
        )}

        {msg && (
          <p className="alert alert-success">{msg}</p>
        )}

        {!isEdit ? (
          <h2>Add user</h2>
        ) : (
          <h2>Edit User</h2>
        )}

        <form className="data-entry-form">

        <DataInput
          required={true}
          text="Username"
          id="username"
          placeholder="Enter name"
          value={username}
          onChange={this.onChange}
          name="username"/>

        {isEdit ? (
            <div className="form-group">
              <button className="btn btn-info">
                Change password
              </button>
            </div>
          ):(
            <DataInput
            required={true}
            type="password"
            text="Password"
            id="password"
            value={password}
            onChange={this.onChange}
            name="password"/>
          )}

        <DataInput
          required={true}
          text="Email"
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={this.onChange}
          name="email"/>

        <DataInput
          required={true}
          text="Phone"
          id="phone"
          placeholder="Enter phone"
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

          {/* Radio buttons role */}
          <p>Role: <span className="red-text"> *</span></p>
          <RadioGroup
          options={['admin', 'editor', 'salesrep']}
          name="role"
          role={role}
          onChange={this.onRoleChange}/>

          <br/>

          <TextArea
          text="Notes"
          id="notes1"
          placeholder="Enter notes"
          value={notes}
          onChange={this.onChange}
          name="notes"/>
        </form>


        <div className="footer-buttons">
          {isEdit ? (
            <>
              <button type="submit" className="btn btn-primary"
              onClick={e => this.update(e)}>
                Update
              </button>
              <button
              style={{marginLeft: '10px'}}
              className="btn btn-danger"
              onClick={e => this.openPrompt(e)}>
                Remove
              </button>
            </>
          ) : (
            <button type="submit" className="btn btn-primary"
            onClick={e => this.create(e)}>Create</button>
          )}
          <button 
          className="btn btn-default"
          onClick={() => this.props.history.push('/manage-users')}>Back</button>
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

export default withRouter(UserInput);