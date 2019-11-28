import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { getQuote, removeFromQuote } from '../../../utils/QuoteAPI';
import { getCustomer } from '../../../utils/CustomerAPI';
import { getItems } from '../../../utils/ItemAPI';
import { sendMail } from '../../../utils/EmailAPI';

import Prompt from '../../UtilComps/Prompt';
import Loading from '../../App/Loading';

import QuoteList from './QuoteList';
import CustomerInfo from './CustomerInfo';

class QuoteSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: null,
      selectedItems: [],
      isAllSelect: false,
      customer: null,
      isSendPrompt: false,
      isDeletePrompt: false,
      emailSentNotification: false,
      msg: '',
      isLoading: true
    }
    this.onEditCustomer = this.onEditCustomer.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.toggleAllSelect = this.toggleAllSelect.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onOpenSendPanel = this.onOpenSendPanel.bind(this);
    this.onOpenDeletePanel = this.onOpenDeletePanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

  componentDidMount() {
    const quoteID = this.getParameterByName('id');
    const customerName = this.getParameterByName('name');
    // get the necessary information from the database
    // get the quote
    getQuote(quoteID).then(json => {
      if (json.success) {
        const quote = json.quote
        // get the customer
        getCustomer(customerName).then(json => {
          if (json.success) {
            this.setState({
              customer: json.customer,
              isLoading: false,
              quote
            });
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

  onEditCustomer(e) {
    e.preventDefault();
    this.props.history.push('/customer-2/' + this.state.customer._id);
  }

  onSelect(itemToBeSelected) {
    const { selectedItems, quote } = this.state;
    // check if item is already selected
    let bool = false;
    let newArr;
    selectedItems.forEach(item => {
      if (item.name === itemToBeSelected.name) bool = true
    });
    if (bool) {
      // delete item from list
      newArr = selectedItems.filter(item => item.name !== itemToBeSelected.name);
    } else {
      // concatenate item to the list
      newArr = selectedItems.concat(itemToBeSelected);
    }
    this.setState({
      selectedItems: newArr,
      isAllSelect: quote.items.length == newArr.length ? true : false
    });
  }

  toggleAllSelect() {
    const { isAllSelect, quote } = this.state;
    // check if all is already selected, then select nothing;
    let newArr;
    if (isAllSelect) {
      newArr = [];
    } else {
      // 
      newArr = quote.items;
    }

    this.setState(prevState => ({
      selectedItems: newArr,
      isAllSelect: !prevState.isAllSelect
    }));
  }

  onDelete(e) {
    // delete the item(s) that has(ve) been selected
    e.preventDefault();
    this.setState({ isLoading: true });

    const { quote, selectedItems } = this.state;

    if (selectedItems.length > 0) {
      removeFromQuote(selectedItems, quote._id).then(json => {
        if (!json.success) {
          this.setState({
            msg: json.message,
            isLoading: false
          });
        } else {
          // remove selectedItems from the items array of quote and set the new quote object
          const itemsArr = [];
          quote.items.forEach(item => {
            let bool = false;
            selectedItems.forEach(selectedItem => {
              if (item.name === selectedItem.name) {
                bool = true;
              }
            });
            if (!bool) {
              itemsArr.push(item);
            }
          });
          // amend quote obj
          quote.items = itemsArr;
          this.setState({
            quote,
            selectedItems: [],
            isDeletePrompt: false,
            isLoading: false
          });
        }
      });
    }
  }

  onOpenSendPanel(e) {
    e.preventDefault();
    this.setState({
      isSendPrompt: true
    });
  }

  onOpenDeletePanel(e) {
    e.preventDefault();
    this.setState({
      isDeletePrompt: true
    });
  }

  onClosePanel(e) {
    e.preventDefault();
    if (e.target.classList.value === 'prompt-container' || e.target.classList.value === 'btn btn-danger back-btn') {
      this.setState({
        isSendPrompt: false,
        isDeletePrompt: false
      });
    }
  }

  onSend(e) {
    e.preventDefault();
    this.setState({ isLoading: true });

    const { quote, customer } = this.state;
    if (quote.items.length > 0) {
      // send the quote mail to the customer with the quote object
      sendMail(customer, quote).then(json => {
        if (!json.success) {
          this.setState({
            isSendPrompt: false,
            msg: json.message,
            isLoading: false
          });
        } else {
          this.setState({
            emailSentNotification: true,
            isLoading: false
          });
          setTimeout(() => {
            this.setState({
              emailSentNotification: false,
              isSendPrompt: false
            });
          }, 3000);
        }
      });
    } else {
      this.setState({
        msg: 'No items in quote, please add items before sending the quote',
        isLoading: false
      })
    }
  }

  render() {
    const { msg, customer, quote, selectedItems, isAllSelect, isSendPrompt, isDeletePrompt, emailSentNotification, isLoading } = this.state;

    return (
      <>

      {isLoading && (
        <Loading/>
      )}

      {isSendPrompt && (
        <Prompt
        text={'Send quote to: ' + customer.email}
        onBack={this.onClosePanel}
        onConfirm={this.onSend}
        success={emailSentNotification}
        successText='Email Sent!'
        />
      )}

      {isDeletePrompt && (
        <Prompt
        text={'Are you sure?'}
        onBack={this.onClosePanel}
        onConfirm={this.onDelete}
        />
      )}

      <div
      className="quote-summary-container">

        {msg && (
          <p className="alert alert-danger">{msg}</p>
        )}

        {customer !== null && (
          <CustomerInfo
          customer={customer}
          onEditCustomer={this.onEditCustomer}/>
        )}

        {quote !== null && (
          <QuoteList
          quote={quote}
          toggleAll={this.toggleAllSelect}
          isAllSelect={isAllSelect}
          onOpenDeletePanel={this.onOpenDeletePanel}
          onSelect={this.onSelect}
          selectedItems={selectedItems}/>
        )}

        <div className="footer-buttons">
          <button
          className="btn btn-danger"
          onClick={e => this.onOpenSendPanel(e)}>
            Quote
          </button>

          <button 
          className="btn btn-default"
          onClick={() => this.props.history.push(`/quote/${quote._id}`)}>
            Back
          </button>
        </div>

      </div>

      </>
    )
  }
}

export default withRouter(QuoteSummary);