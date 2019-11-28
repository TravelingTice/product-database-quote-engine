import React from 'react';

// here just for naming convention: Quoteinput will be used in both newQuote and editQuote
import QuoteInput from './QuoteInput';

const NewQuote = props => (
  <>
  <h2>New quote</h2>
  <QuoteInput/>
  </>
);

export default NewQuote;