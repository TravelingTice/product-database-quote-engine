import React, { Component } from 'react';

import { Link } from 'react-router-dom';

class AddedItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: false
    }
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  toggleSelect(item) {
    this.setState(prevState => ({
      isSelected: !prevState.isSelected
    }));
    this.props.onSelect(item, this.state.isSelected);
  }

  render() {
    const { isSelected } = this.state;
    const { item } = this.props;
    return (
      <li className="added-item">
        <input
        checked={isSelected}
        type="checkbox"
        onChange={() => this.toggleSelect(item)}/>
        <img src={item.images[0]} alt={item.name}/>
        <span>{item.name}</span>
        <Link 
        className="btn btn-danger"
        to={`/view/${item._id}`}>View</Link>
      </li>
    );
  }
}

export default AddedItem;