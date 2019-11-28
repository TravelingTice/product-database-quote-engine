import React, { Component } from 'react';

import { getItemByID } from '../../utils/ItemAPI';

import Radio from '../UtilComps/Radio';
import DataInput from '../UtilComps/DataInput';

import Loading from '../App/Loading';

class ViewItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: null,
      color: 'white',
      msg: '',
      colorIsOther: false,
      isLoading: true
    }

    this.onChangeColor = this.onChangeColor.bind(this);
    this.onSpecifyColor = this.onSpecifyColor.bind(this);
  }
  
  componentDidMount() {
    const { match: { params } } = this.props;
    getItemByID(params.id).then(json => {
      if (json.success) {
        this.setState({
          item: json.item,
          isLoading: false
        });
      } else {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      }
    });
  }

  onChangeColor(color) {
    if (color === 'other') {
      this.setState({
        colorIsOther: true,
        color: ''
      });
    } else {
      this.setState({
        colorIsOther: false,
        color
      });
    }
  }

  onSpecifyColor(e, query) {
    this.setState({
      color: query
    });
  }

  render() {
    const { item, color, msg, colorIsOther, isLoading } = this.state;
    return (
      <>
        {isLoading && (
          <Loading/>
        )}
        {msg && (
          <p className="alert alert-danger">{msg}</p>
        )}
        {item && (
          <div
          className="view-item-container">
            <h2>{item.name}</h2>
            <p>Sku #{item.sku}</p>
            <div className="row top-main">
              <div className="col">
                <img src={item.imageName} alt={item.name}/>
              </div>
              <div className="col">
                <p>Unit Price <span className="large">{item.unitPrice}</span></p>
                <p>Quantity <span className="large">{item.quantity}</span></p>
                <p>CBM <span className="large">{item.CBM}</span></p>
                <p>CTNS <span className="large">{item.CTNS}</span></p>
                <p>Total <span className="large">{item.total}</span></p>
              </div>
            </div>
            <div className="row header">
              <h3>Product information</h3>
            </div>
            <div className="row product-info-main">
              <div className="col">
                <Radio 
                id="white"
                group="color"
                text="White"
                onChange={this.onChangeColor}/>
                <Radio 
                id="black"
                group="color"
                text="Black"
                onChange={this.onChangeColor}/>
                <Radio
                id="other"
                group="color"
                text="Other"
                onChange={this.onChangeColor}/>
                {colorIsOther && (
                  <DataInput
                  placeholder="Please Specify"
                  value={color}
                  onChange={this.onSpecifyColor}
                  id="otherColor1"/>
                )}
              </div>
              <div className="col-6">
                <p>Overall <span>{item.overallDim}</span></p>
                <p>Photo <span>{item.photoDim}</span></p>
                <p>Frame <span>{item.frameDim}</span></p>
                <p>MOQ <span>{item.MOQ}</span></p>
              </div>
              <div className="col">
                <p className="bold">Materials:</p>
                {item.materials && (
                  <>
                  {item.materials.map(material => (
                    <p>{material}</p>
                  ))}
                  </>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="header">
                  <h3>Packing information</h3>
                </div>
                <div className="packing-main">
                  <p>Pcs/carton {item.carton}</p>
                  <p>CBM/carton</p>
                </div>
              </div>
              <div className="col">
                <div className="header">
                  <h3>Delivery information</h3>
                </div>
                <div className="delivery-main">
                  <p>{item.deliveryInfo}</p>
                </div>
              </div>
            </div>
            <div className="row header">
              <h3>Notes</h3>
            </div>
            <div className="notes-main">
                <p>{item.notes}</p>
              </div>
          </div>
        )}
      </>
    )
  }
}

export default ViewItem;