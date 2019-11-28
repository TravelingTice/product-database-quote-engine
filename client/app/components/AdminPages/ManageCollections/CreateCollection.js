import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import DataInput from '../../UtilComps/DataInput';

import Loading from '../../App/Loading';

import { createCollection } from '../../../utils/CollectionAPI';

class CreateCollection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      msg: '',
      isLoading: false
    }
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange(e, name) {
    this.setState({
      name
    });
  }

  submit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });

    createCollection(this.state.name)
    .then(json => {
      if (json.success) {
        this.props.history.push('/manage-collections');
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }

  render() {
    const { name, msg, isLoading } = this.state;
    return (
      <>
        {isLoading && (
          <Loading/>
        )}

        <h2>Create collection</h2>

        {msg && (
          <p className="alert alert-success">{msg}</p>
        )}

        <DataInput
        id="nameInput1"
        value={name}
        name="name"
        onChange={this.onChange}
        text="Collection name"
        placeholder="Enter name"/>

        <div className="footer-buttons">

          <button
          className="btn btn-danger"
          onClick={e => this.submit(e)}>
            Create
          </button>

          <button 
          className="btn btn-default"
          onClick={() => this.props.history.push('/manage-collections')}>
            Back
          </button>

        </div>
      </>
    )
  }
}

export default withRouter(CreateCollection);