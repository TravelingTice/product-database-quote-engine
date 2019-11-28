import React from 'react';

const Radio = props => (
  <div className="custom-control custom-radio">
    <input
    className="custom-control-input"
    type="radio"
    id={props.id}
    name={props.group}
    value={props.id}
    onChange={props.onChange ? () => props.onChange(props.id) : null}/>
    <label
    className="custom-control-label"
    htmlFor={props.id}>{props.text}</label>
  </div>
);

export default Radio;