import React, { Component } from 'react';

import { getQuote } from '../../../utils/QuoteAPI';

import QuoteInput from './QuoteInput';

import Loading from '../../App/Loading';

class EditQuote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: null,
      msg: '',
      isLoading: true
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    getQuote(params.quoteID).then(json => {
      if (json.success) {
        this.setState({
          quote: json.quote,
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
  
  render() {
    const { quote, msg, isLoading } = this.state;
    return (
      <>
      {isLoading && (
        <Loading/>
      )}
      <div>
        {msg && (
          <p className="alert alert-danger">{msg}</p>
        )}
        <h2>Edit Quote</h2>
          {quote !== null && (
            <QuoteInput
            quote={quote}/>
          )}
      </div>
      </>
    )
  }
}

export default EditQuote;