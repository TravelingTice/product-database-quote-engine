import React from 'react';

import PropTypes from 'prop-types';

const DataInputSm = props => (
  <div className={props.xAfter ? 'form-group form-group-sm form-group-x' : 'form-group form-group-sm'}>
    {props.text && (
      <label htmlFor={props.id}>{props.text}</label>
    )}
    <input
    type={props.type ? props.type : 'text'}
    className="form-control"
    name={props.name}
    id={props.id}
    aria-describedby={props.aria ? props.aria : 'nameHelp'}
    placeholder={props.placeholder ? props.placeholder : ''}
    value={props.value}
    onChange={e => props.onChange(props.name, e.target.value)}/>
    {props.required && (
      <span className="red-text"> *</span>
    )}
  </div>
);

DataInputSm.propTypes = {
  text: PropTypes.string,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  aria: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func.isRequired,
  xAfter: PropTypes.bool
}

export default DataInputSm;