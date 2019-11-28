import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import DataInput from '../../UtilComps/DataInput';
import ListItem from '../../UtilComps/ListItem';

class SearchItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      msg: ''
    }
    this.updateQuery = this.updateQuery.bind(this);
  }

  updateQuery(e, query) {
    this.setState({
      query
    });
  }
  
  render() {
    const { query, msg } = this.state;
    const { items } = this.props;

    let showingItems;
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i');
      showingItems = items.filter(item => match.test(item.tags) || match.test(item.name))
    } else {
      showingItems = [];
    }

    showingItems.sort(sortBy('name'));

    return (
      <>
        <DataInput
        id="text1"
        name="query"
        text="Search"
        placeholder="Search items"
        value={query}
        onChange={this.updateQuery}/>
        {msg && (
          <p>{msg}</p>
        )}
        {showingItems && (
          <ul className='search-results'>
            {showingItems.map(item => (
              <ListItem
              key={item._id}
              onSelect={this.props.onSelect}
              onRemove={this.props.onRemove}
              item={item}/>
            ))}
          </ul>
        )}
      </>
    )
  }
}

export default SearchItems;