import React, { Component } from 'react';
import ItemInput from './ItemInput';

class EditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      msg: ''
    }
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    this.setState({ id: params.id });
  }
  render() {
    const { id, msg } = this.state;
    return (
      <>
        {msg && (
          <p className="alert alert-danger">{msg}</p>
        )}
        {id !== null && (
          <ItemInput
          id={id}/>
        )}
      </>
    )
  }
}

export default EditItem;