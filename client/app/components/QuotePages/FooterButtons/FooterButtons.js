import React from 'react';

const FooterButtons = props => (
  <div className="footer-buttons">
    <button 
    className="btn btn-success"
    onClick={props.onAdd}>
      Add
    </button>
    <button 
    className="btn btn-danger"
    onClick={props.onQuote}>
      Quote
    </button>
    <button 
    className="btn btn-warning"
    onClick={props.onClear}>
      Clear
    </button>
  </div>
);

export default FooterButtons;