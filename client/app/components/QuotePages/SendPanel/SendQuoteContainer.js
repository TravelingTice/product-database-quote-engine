import React from 'react';

import SendQuote from './SendQuote';

const SendQuoteContainer = props => (
  <div 
  className="send-quote-container prompt-container"
  onClick={e => (props.onCloseSendWindow(e))}>
    <SendQuote
    user={props.user}
    items={props.items}/>
  </div>
);

export default SendQuoteContainer;