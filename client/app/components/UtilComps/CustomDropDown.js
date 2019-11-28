import React from 'react';

import PropTypes from 'prop-types';

const CustomDropDown = props => (
  <div className="form-group">
    <label htmlFor={props.id}>{props.text}</label>
    <select 
    className="form-control" id={props.id}
    value={props.value}
    onChange={e => props.onChange(props.name, e.target.value)}>
      <option> </option>
      {props.options.map((option, i) => (
        <option key={i}>{option}</option>
      ))}
    </select>
  </div>
);

CustomDropDown.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // value can be string or array, depends on if its multiselect or not
  value: PropTypes.string,
  valueArr: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  isMultiSelect: PropTypes.bool,
  // only required when isMultiSelect is true
  onMultiSelectChange: PropTypes.func
}

export default CustomDropDown;