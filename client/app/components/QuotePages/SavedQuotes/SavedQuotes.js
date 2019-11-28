import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { getQuotes, removeQuote } from '../../../utils/QuoteAPI';

import { getCurrentUser } from '../../../utils/AccountAPI';

import SavedQuote from './SavedQuote';

import Prompt from '../../UtilComps/Prompt';
import Loading from '../../App/Loading';

class SavedQuotes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      quotes: [],
      msg: '',
      toBeRemoved: null,
      isPrompt: false,
      isLoading: true
    }

    this.onRemove = this.onRemove.bind(this);
    this.onClickQuote = this.onClickQuote.bind(this);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);
  }
  
  componentDidMount() {
    getCurrentUser().then(json => {
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        })
      } else {
        getQuotes(json.user).then(json => {
          if (json.success) {
            this.setState({
              quotes: json.quotes.reverse(),
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
    });
  }

  onRemove(e) {
    const { toBeRemoved } = this.state;
    this.setState({ isLoading: true });

    e.preventDefault();
    removeQuote(toBeRemoved).then(json => {
      if (json.success) {
        this.setState(prevState => ({
          quotes: prevState.quotes.filter(quote => quote._id !== toBeRemoved),
          isLoading: false,
          isPrompt: false
        }));
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        })
      }
    })
  }

  onClickQuote(id, e) {
    e.preventDefault();
    this.props.history.push(`quote/${id}`);
  }

  onOpenPanel(e, id) {
    e.preventDefault();

    // set in state the id to be removed, because the prompt won't know it
    this.setState({
      isPrompt: true,
      toBeRemoved: id
    });
  }

  onClosePanel(e) {
    e.preventDefault();

    if (e.target.classList.value === 'prompt-container' || e.target.classList.value === 'btn btn-danger back-btn') {
      this.setState({
        isPrompt: false,
        toBeRemoved: null
      });
    }
  }

  render() {
    const { quotes, msg, isPrompt, isLoading } = this.state;
    return ( 
      <>
        {isLoading && (
          <Loading/>
        )}
        {msg && (
          <p className="alert alert-danger">{msg}</p>
        )}

        {isPrompt && (
          <Prompt
          text={'Are you sure?'}
          onBack={this.onClosePanel}
          onConfirm={this.onRemove}
          />
        )}

        <h2>My Saved Quotes</h2>
        <ul className="saved-quotes-list">
          {quotes.map(quote => (
            <SavedQuote
            key={quote._id}
            quote={quote}
            onClickQuote={this.onClickQuote}
            onOpenPanel={this.onOpenPanel}/>
          ))}
        </ul>
      </>
    )
  }
}

export default withRouter(SavedQuotes);
