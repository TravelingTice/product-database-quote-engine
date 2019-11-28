import React, { Component } from 'react';

import { getItems } from '../../../utils/ItemAPI';

import { createQuote, removeFromQuote, updateQuote } from '../../../utils/QuoteAPI';
import { getCurrentUser } from '../../../utils/AccountAPI';

import { setInStorage } from '../../../utils/storage';

import SearchItems from './SearchItems';
import SendQuoteContainer from '../SendPanel/SendQuoteContainer';
import AddedItemsList from '../AddedItemsList/AddedItemsList';
import FooterButtons from '../FooterButtons/FooterButtons';

import Loading from '../../App/Loading';

class QuoteInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
        items: [],
        addedItems: [],
        isSendOpen: false,
        isListOpen: false,
        isQuoteCreated: false,
        user: '',
        _id: '',
        msg: '',
        isLoading: true
    }
    this.onSelect = this.onSelect.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onToggleListWindow = this.onToggleListWindow.bind(this);
    this.onOpenSendWindow = this.onOpenSendWindow.bind(this);
    this.onCloseSendWindow = this.onCloseSendWindow.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  componentDidMount() {
    const { quote } = this.props;
    // get current user
    getCurrentUser().then(json => {
      if (json.success) {
        const user = json.user;
        // get items
        getItems().then(json => {
          if (json.success) {
            let itemsArr = [];
            // if it is a new quote (no id has been passed thru), all properties of the item are empty (false)
            if (!this.props.quote) {
              // NEW QUOTE
              json.items.forEach(item => {
                item.isSelected = false;
                item.isAdded = false;
                itemsArr.push(item);
              });
              this.setState({
                items: itemsArr,
                user,
                isLoading: false
              });
            } else {
              // EDIT QUOTE
              // if its a quote edit, some properties have been added to a list, here we filter thru it and set the 'isAdded' prop of the items to true if its in the list
              // also add those to the added items arr
              const addedItemsArr = [];
              json.items.forEach(item => {
                item.isSelected = false;
                item.isAdded = false;
                // check if name is in quote list
                quote.items.forEach(addedItem => {
                  if (item.name === addedItem.name) {
                    item.isAdded = true;
                    addedItemsArr.push(item);
                  }
                });
                itemsArr.push(item);
              });
              // and we save the quote id in the localstorage, for quote sending later
              setInStorage('current_quote', { id: quote._id });

              this.setState({
                items: itemsArr,
                addedItems: addedItemsArr,
                user,
                _id: quote._id,
                isListOpen: addedItemsArr.length > 0 ? true : false,
                isQuoteCreated: true,
                isLoading: false
              })
            }
          } else {
            this.setState({
              msg: json.message,
              isLoading: false
            });
          }
        });
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }

  onSelect(clickedItem) {
    // needs to select item
    const arr = [];
    this.state.items.forEach(item => {
      if (item.name === clickedItem.name) {
        item.isSelected = !item.isSelected
      }
      arr.push(item)
    });
    this.setState({
      items: arr
    });
  }

  onAdd() {
    this.setState({ isLoading: true });
    
    const { items, addedItems, user, isQuoteCreated, _id } = this.state;
    // new array for all items, for display and added items for list
    const arr = [];
    // we take the old list, so not to disturb the sorting of the list
    const addedItemsArr = addedItems;
    // add name of items that are selected in the list to the quote
    items.forEach(item => {
      if (item.isSelected || item.isAdded) {
        // check if NEW item (i.e. item that is selected but not added already) -> add to added items arr
        if (item.isSelected && !item.isAdded) {
          addedItemsArr.push(item);
        }
        // make item added
        item.isSelected = false;
        item.isAdded = true;
      }
      arr.push(item);
    });
    // set frontend state of items to this array for searching
    // set items added in quote array in state as well, used for summary panel
    this.setState({
      items: arr,
      addedItems: addedItemsArr
    });


    // --------------------------------------------
    // BACKEND
    /*
    * if its the start of a new quote
    */
    if (!isQuoteCreated) {
      // quote has not yet been created in the database, so we need to create a new one with the added items
      const newQuote = {
        user,
        items: addedItemsArr
      };
      createQuote(newQuote).then(json => {
        if (json.success) {
          this.setState({
            isQuoteCreated: true,
            isLoading: false,
            _id: json.quoteID
          });
          // save quote in localstorage
          setInStorage('current_quote', { id: json.quoteID });
        } else {
          this.setState({
            msg: json.message,
            isLoading: false
          });
        }
      });
    } else {
      // Edited quote use the specific id to update
      updateQuote(addedItemsArr, _id).then(json => {
        if (!json.success) {
          this.setState({
            msg: json.message,
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          })
        }
      });
    }
  }

  onToggleListWindow(e) {
    this.setState(prevState => ({
      isListOpen: !prevState.isListOpen
    }));
  }

  onOpenSendWindow() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.setState({
      isSendOpen: true
    });
  }

  onCloseSendWindow(e) {
    if (e.target.classList.value === 'send-quote-container prompt-container') {
      this.setState({
        isSendOpen: false
      });
    }
  }

  onClear() {
    const { items } = this.state;
    const newArr = [];
    items.forEach(item => {
      item.isSelected = false
      newArr.push(item);
    });
    this.setState({
      items: newArr
    });
  }

  onRemove(itemsToBeDeleted, bool) {
    this.setState({ isLoading: true });

    const { items, addedItems, _id } = this.state;
    const arr = [];
    let addedItemsArr = addedItems;
    items.forEach(item => {
      // if the item name that has to be removed is this name
      itemsToBeDeleted.forEach(itemToBeDeleted => {
        if (item.name === itemToBeDeleted.name) {
          // filter the added items arr with removed item
          addedItemsArr = addedItemsArr.filter(addedItem => addedItem.name !== itemToBeDeleted.name);
          // set values of item in the items arr
          item.isAdded = false;
          item.isSelected = true; // this is set to true because you also click the card, which means it's gonna toggle this value,
          if (bool) {
            item.isSelected = false;
          } // but if the remove method is called via the added items side panel, the cross is not clicked, so it won't be selected. Hence the 'bool' as an indicator
        }
      });
      arr.push(item);
    });
    // if list gets cleared completely, also close the list panel
    if (addedItemsArr.length == 0) {
      this.setState({ isListOpen: false });
    }
    this.setState({
      items: arr,
      addedItems: addedItemsArr
    });

    // BACKEND
    // Remove item from the right quote in the database (difference between an edited quote or the quote is new in which the most recent quote will be edited, if not we need to find the old quote with the id)
    removeFromQuote(itemsToBeDeleted, _id).then(json => {
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false });
      }
    });
  }

  render() {
    const { items, addedItems, isListOpen, msg, isSendOpen, user, isLoading } = this.state;
    return (
      <div>
        {isLoading && (
          <Loading/>
        )}
        
        {msg && (
          <p 
          className="alert alert-danger">{msg}</p> 
        )}

        <SearchItems
          items={items}
          onSelect={this.onSelect}
          onRemove={this.onRemove}/>
        
        {addedItems.length > 0 && (
          <AddedItemsList
          isOpen={isListOpen}
          togglePanel={this.onToggleListWindow}
          items={addedItems}
          onRemove={this.onRemove}/>
        )}

        {isSendOpen && (
          <SendQuoteContainer
          onCloseSendWindow={this.onCloseSendWindow}
          items={items}
          user={user}/>
        )}
        
        <FooterButtons
          onClear={this.onClear}
          onAdd={this.onAdd}
          onQuote={this.onOpenSendWindow}/>
      </div>
    )
  }
}

export default QuoteInput;