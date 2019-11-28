import React from 'react';

import PropTypes from 'prop-types';

const Prompt = props => (
  <div 
  className="prompt-container"
  onClick={e => props.onBack(e)}>
    <div className="prompt">
      {props.success && (
        <div className="success-notification">
          <p>{props.successText}</p>
        </div>
      )}
      <p>{props.text}</p>
      <div className="buttons">
        <button 
        className="btn btn-danger back-btn">
          {props.backText ? props.backText : 'Back'}
        </button>
        <button 
        className="btn btn-info"
        onClick={e => props.onConfirm(e)}>
          {props.confirmText ? props.confirmText : 'Confirm'}
        </button>
      </div>
    </div>
  </div>
);

Prompt.propTypes = {
  onBack: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  success: PropTypes.bool,
  successText: PropTypes.string,
  text: PropTypes.string.isRequired,
  backText: PropTypes.string,
  confirmText: PropTypes.string

}

export default Prompt;