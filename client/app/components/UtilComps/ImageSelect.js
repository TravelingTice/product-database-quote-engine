import React from 'react';

import PropTypes from 'prop-types';

const ImageSelect = props => (
  <div className="image-select">
    <p style={{fontSize: '18px', marginBottom: '2px'}}>{props.title}</p>
    <div className="input-group">
      <label 
      htmlFor="fileInput1"
      className="custom-file-label">{props.placeholder ? props.placeholder : ''}
      {props.required && (
        <span className="red-text"> *</span>
      )}</label>
      <div className="custom-file">
        <input
        className="custom-file-input"
        onChange={e => props.onImageSelect(e, props.index)}
        type="file"
        name="myFile"/>
      </div>
    </div>
    {props.preview !== null ? (
      <img className="image-preview" src={props.preview}/>
    ) : (
      <div className="image-placeholder"></div>
    )}
    {/* <small>Picture cannot be larger than 3 mb</small> */}
  </div>
);

ImageSelect.propTypes = {
  title: PropTypes.string.isRequired,
  onImageSelect: PropTypes.func.isRequired,
  preview: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  index: PropTypes.number
}

export default ImageSelect;