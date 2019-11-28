import React from 'react';

import PropTypes from 'prop-types';

const RadioGroup = props => (
  <>
  {props.options.map((option, i) => (
  <div className="form-check" key={i}>
    <input 
    onChange={e => props.onChange(option)} 
    type="radio" 
    className="form-check-input" 
    id={option} 
    name={props.name} 
    value={option}
    checked={option === props.role}/>
    <label className="form-check-label" htmlFor={option}>{option}</label>
  </div>
  ))}
  </>
);

RadioGroup.propTypes = {
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default RadioGroup;