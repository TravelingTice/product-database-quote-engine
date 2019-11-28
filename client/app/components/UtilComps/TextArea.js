import React from 'react';

import propTypes from 'prop-types';

const TextArea = props => (
  <div className="form-group">
    {props.text && (
      <label htmlFor={props.id}>{props.text}
        {props.required && (
          <span className="red-text"> *</span>
        )}
      </label>
    )}
    <textarea
    className="form-control"
    id={props.id}
    aria-describedby={props.aria ? props.aria : 'nameHelp'}
    placeholder={props.placeholder}
    value={props.value}
    onChange={e => props.onChange(props.name, e.target.value)}>
    </textarea>
  </div>
);

TextArea.propTypes = {
  id: propTypes.string.isRequired,
  placeholder: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  title: propTypes.string,
  aria: propTypes.string,
  required: propTypes.bool
}

export default TextArea;
