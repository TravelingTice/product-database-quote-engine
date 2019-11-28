import React from 'react';

import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

import { createObjArr } from '../../utils/multiselect';

const CustomMultiSelect = props => {
  
  // create special options array for all options and selected options
  const options = createObjArr(props.options);
  const value = createObjArr(props.selectedArr);

  return (
    <>
    <p>{props.text}</p>
    <ReactMultiSelectCheckboxes
    options={options}
    onChange={props.onChange}
    value={value}
    name={props.name}
    id={props.id}/>
    </>
  );
}


export default CustomMultiSelect;