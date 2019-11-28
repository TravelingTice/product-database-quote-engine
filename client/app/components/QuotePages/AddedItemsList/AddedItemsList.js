import React, { Component } from 'react';

import AddedItem from './AddedItem';

class AddedItemsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItems: []

    }
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(selectedItem, bool) {
    // bool is true for if the item is deselected
    if(bool) {
      // remove item from selection
      this.setState(prevState => ({
        selectedItems: prevState.selectedItems.filter(item => item.name !== selectedItem.name)
      }));
    } else {
      // add item to selection
      this.setState(prevState => ({
        selectedItems: prevState.selectedItems.concat(selectedItem)
      }));
    }
  }

  onDeleteAll() {
    const { selectedItems } = this.state;
    // call remove method from quote input
    this.props.onRemove(this.props.items, true);
    // deselect all selected items
    this.setState({
      selectedItems: []
    });
  }

  onDelete() {
    const { selectedItems } = this.state;
    // call remove method from quote input
    this.props.onRemove(selectedItems, true);
    // deselect all selected items
    this.setState({
      selectedItems: []
    });
  }

  render() {
    const { selectedItems, isAllSelected } = this.state;
    const { items, isOpen, togglePanel } = this.props;
    return (
      <>
        <button 
        className={isOpen ? "added-items-btn open" : "added-items-btn btn btn-success"}
        onClick={e => togglePanel(e)}>
          {isOpen ? (
            <> {">"} </>
          ) : (
            <> Items ({items.length}) </>
          )}
        </button>

        {isOpen && (
          <div className="behind-list"
          onClick={e => togglePanel(e)}>
              {/* this div is here to take over the whole screen when this addedItemsList is on screen. So whenever the user clicks on this part, it will remove the list again */}
          </div>
        )}

        {/* this is a white panel in front of the items panel, this is another div because of overflow scroll issues */}

        <div className={isOpen ? 'footer-background open' : 'footer-background'}>

          <button 
          className='btn btn-danger btn-delete'
          disabled={selectedItems.length <= 0}
          onClick={() => this.onDelete()}>
            Delete
          </button>
        
          <button 
            className="btn btn-warning btn-delete-all"
            onClick={() => this.onDeleteAll()}>
              Delete All
            </button>
        </div>


        {/* the selected items panel */}

        <div className={isOpen ? 'added-items-panel open' : 'added-items-panel'}>

          <div className="added-items-container">
            <ul className="items-list">
              {items.map(item => (
                <AddedItem
                key={item._id}
                item={item}
                onSelect={this.onSelect}/>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
}

export default AddedItemsList;