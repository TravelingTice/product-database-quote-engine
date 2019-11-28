import React, { Component } from 'react';

import propTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

// API services
import { createItem, getItemByID, updateItem, deleteItemById } from '../../../utils/ItemAPI';
import { getCollectionNames } from '../../../utils/CollectionAPI';
import { getVendorNames } from '../../../utils/VendorAPI';

// utils
import { revertToStringArr } from '../../../utils/multiselect';

// Utility components
// local
import PackingDimensionsTable from './PackingDimensionsTable';

// from UtilComps folder
import TextArea from '../../UtilComps/TextArea';
import DataInput from '../../UtilComps/DataInput';
import DataInputSm from '../../UtilComps/DataInputSm';
import ImageSelect from '../../UtilComps/ImageSelect';
import CustomDropDown from '../../UtilComps/CustomDropDown';
import CustomMultiSelect from '../../UtilComps/CustomMultiSelect';
import Prompt from '../../UtilComps/Prompt';
import Loading from '../../App/Loading';

// props: Item, if in edit mode

class ItemInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // item
      _id: '',
      name: '',
      sku: '',
      newImages: [],
      imagePreviews: [],
      tags: '',
      unitPriceUSD: '',
      unitPriceRMB: '',
      color: '',
      overallDim: '',
      MOQ: '',
      shrinkQTYCTN: '',
      shrinkH: '',
      shrinkW: '',
      shrinkD: '',
      ppQTYCTN: '',
      ppH: '',
      ppW: '',
      ppD: '',
      displayQTYCTN: '',
      displayH: '',
      displayW: '',
      displayD: '',
      collectionNames: [],
      vendor: '',
      notes: '',
      // gets fetched from the databases, for select options
      vendors: [],
      collections: [],
      // this is for when editing an item, if the properties of the item are loaded on screen
      isEdit: false,
      // directs how many image selects are open
      imageSelectsOpen: 1,
      // this is for when updating an item. If the image has been updated too, we have to call a different api method for updating
      areImagesUpdated: false,
      // display error/update messages
      msg: '',
      // display prompt for when deleting item
      isPrompt: false,
      isLoading: true
    }

    this.onChange = this.onChange.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);
    this.onMultiSelectChange = this.onMultiSelectChange.bind(this);
    this.onAddImageSelect = this.onAddImageSelect.bind(this);
    this.onRemoveImageSelect = this.onRemoveImageSelect.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.create = this.create.bind(this);
    this.onOpenPanel = this.onOpenPanel.bind(this);
    this.onClosePanel = this.onClosePanel.bind(this);
  }

  componentDidMount() {
    // get collections
    getCollectionNames()
    .then(json => {
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      } else {
        const collections = json.collectionNames
        // get vendors
        getVendorNames().then(json => {
          if (!json.success) {
            this.setState({
              msg: json.message,
              isLoading: false
            });
          } else {
            const vendors = json.vendorNames;
            // check if an item name has been passed as a prop, if so then fetch that item and fill it into the state
            if (this.props.id) {
              getItemByID(this.props.id).then(json =>{
                if (!json.success) {
                  this.setState({
                    msg: json.message,
                    isLoading: false
                  });
                } else {
                  const item = json.item;
                  // convert null values in json.item to an empty string ('')
                  const keys = Object.keys(item);
                  keys.forEach(key => {
                    if (item[key] === null) {
                      item[key] = '';
                    }
                  });

                  this.setState({
                    vendors,
                    collections,
                    ...item,
                    imagePreviews: json.item.images,
                    imageSelectsOpen: json.item.images.length,
                    isEdit: true,
                    isLoading: false
                  });
                }
              });
            } else {
              this.setState({
                vendors,
                collections,
                isLoading: false
              });
            }
          }
        });
      }
    });
  }

  onChange(property, value) {
    const keys = Object.keys(this.state);
    keys.forEach(keyName => {
      if (keyName === property) {
        this.setState({
          [keyName]: value
        });
      }
    });
  }

  onMultiSelectChange(selectedOptions) {
    // convert back to 1 string array (strip object)
    const arr = revertToStringArr(selectedOptions);

    this.setState({
      collectionNames: arr
    });
  }

  onImageSelect(e, i) {
    // use FileReader to create a preview for the image
    const currentFile = e.target.files[0];
    // set current file in state first
    const { newImages, imagePreviews } = this.state;
    const imgArr = newImages;
    imgArr[i] = e.target.files[0];
    this.setState({
      newImages: imgArr
    });
    // create preview and put that into the preview array
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const prevArr = imagePreviews;
      prevArr[i] = reader.result;
      this.setState({
        imagePreviews: prevArr,
        areImagesUpdated: true
      });
    }, false);
    reader.readAsDataURL(currentFile);
  }

  onAddImageSelect(e) {
    e.preventDefault();

    this.setState(prevState => ({
      imageSelectsOpen: prevState.imageSelectsOpen + 1
    }));
  }

  onRemoveImageSelect(e) {
    e.preventDefault();

    // check if there are more images than windows open, then we have to remove that image + preview as well.
    const { imagePreviews, imageSelectsOpen } = this.state;
    if (imagePreviews.length === imageSelectsOpen) {
      this.setState(prevState => ({
        newImages: prevState.newImages.filter((image, i) => i !== imageSelectsOpen - 1),
        imagePreviews: prevState.imagePreviews.filter((image, i) => i !== imageSelectsOpen - 1),
        imageSelectsOpen: prevState.imageSelectsOpen - 1
      }));
    } else {
      this.setState(prevState => ({
        imageSelectsOpen: prevState.imageSelectsOpen - 1
      }));
    }
  }

  create(e) {
    e.preventDefault();

    this.setState({ isLoading: true });

    const { name, sku, newImages, tags, unitPriceUSD, unitPriceRMB, color, overallDim, MOQ, shrinkQTYCTN, shrinkH, shrinkW, shrinkD, ppQTYCTN, ppH, ppW, ppD, displayQTYCTN, displayH, displayW, displayD, collectionNames, vendor, notes } = this.state;

    const itemData = new FormData();
    itemData.append('name', name);
    itemData.append('sku', sku);
    // to upload each image in multer
    newImages.forEach(image => {
      itemData.append('image', image);
    });
    itemData.append('tags', tags);
    itemData.append('unitPriceUSD', unitPriceUSD);
    itemData.append('unitPriceRMB', unitPriceRMB);
    itemData.append('color', color);
    itemData.append('overallDim', overallDim);
    itemData.append('MOQ', MOQ);
    itemData.append('shrinkQTYCTN', shrinkQTYCTN);
    itemData.append('shrinkH', shrinkH);
    itemData.append('shrinkW', shrinkW);
    itemData.append('shrinkD', shrinkD);
    itemData.append('ppQTYCTN', ppQTYCTN);
    itemData.append('ppH', ppH);
    itemData.append('ppW', ppW);
    itemData.append('ppD', ppD);
    itemData.append('displayQTYCTN', displayQTYCTN);
    itemData.append('displayH', displayH);
    itemData.append('displayW', displayW);
    itemData.append('displayD', displayD);
    collectionNames.forEach(name => {
      itemData.append('collectionNames[]', name);
    });
    itemData.append('vendor', vendor);
    itemData.append('notes', notes);

    // create the item
    createItem(itemData).then(json => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      } else {
        this.props.history.push('/manage-items');
      }
    });
  }
  
  update(e) {
    e.preventDefault();
    const { _id, name, sku, imagePreviews, newImages, tags, unitPriceUSD, unitPriceRMB, color, overallDim, MOQ, shrinkQTYCTN, shrinkH, shrinkW, shrinkD, ppQTYCTN, ppH, ppW, ppD, displayQTYCTN, displayH, displayW, displayD, collectionNames, vendor, notes } = this.state;

    this.setState({ isLoading: true });

    const itemData = new FormData();
    // also attach original id for finding in the database
    itemData.append('_id', _id);
    itemData.append('name', name);
    itemData.append('sku', sku);
    // to upload each image in multer
    newImages.forEach(image => {
      // check if the image put in is a object of the File class
      if (image instanceof File) {
        itemData.append('image', image);
      }
    });
    // to check if any new images are supplied also include newImages array
    itemData.append('images', JSON.stringify(newImages));
    // also check how many images are in there in total (so all the previews);
    itemData.append('imagePreviewsAmnt', imagePreviews.length);

    itemData.append('tags', tags);
    itemData.append('unitPriceUSD', unitPriceUSD);
    itemData.append('unitPriceRMB', unitPriceRMB);
    itemData.append('color', color);
    itemData.append('overallDim', overallDim);
    itemData.append('MOQ', MOQ);
    itemData.append('shrinkQTYCTN', shrinkQTYCTN);
    itemData.append('shrinkH', shrinkH);
    itemData.append('shrinkW', shrinkW);
    itemData.append('shrinkD', shrinkD);
    itemData.append('ppQTYCTN', ppQTYCTN);
    itemData.append('ppH', ppH);
    itemData.append('ppW', ppW);
    itemData.append('ppD', ppD);
    itemData.append('displayQTYCTN', displayQTYCTN);
    itemData.append('displayH', displayH);
    itemData.append('displayW', displayW);
    itemData.append('displayD', displayD);
    collectionNames.forEach(name => {
      itemData.append('collectionNames[]', name);
    });
    itemData.append('vendor', vendor);
    itemData.append('notes', notes);

    updateItem(itemData).then(json => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.setState({
        msg: json.message,
        isLoading: false
      });
    });
  }

  remove(e) {
    e.preventDefault();

    this.setState({ isLoading: true });

    deleteItemById(this.props.id)
    .then(json => {
      if (!json.success) {
        this.setState({
          msg: json.message,
          isLoading: false
        });
      } else {
        this.props.history.push('/manage-items');
      }
    });
  }
  
  onOpenPanel(e) {
    e.preventDefault();

    this.setState({
      isPrompt: true
    });
  }

  onClosePanel(e) {
    e.preventDefault();

    if (e.target.classList.value === 'prompt-container' || e.target.classList.value === 'btn btn-danger back-btn') {
      this.setState({
        isPrompt: false
      });
    }
  }

  render() {
    const { name, sku, newImages, imagePreviews, tags, unitPriceUSD, unitPriceRMB, color, overallDim, MOQ, shrinkQTYCTN, shrinkH, shrinkW, shrinkD, ppQTYCTN, ppH, ppW, ppD, displayQTYCTN, displayH, displayW, displayD, collectionNames, vendor, notes, vendors, collections, imageSelectsOpen, isEdit, msg, isPrompt, isLoading } = this.state;
    return (
      <>
        {isLoading && (
          <Loading/>
        )}
        {msg && (
          <p className="alert alert-success">{msg}</p>
        )}
        <form className="data-entry-form">
          {/* difference between add and edit: in edit you CANNOT change the name or image!!! */}
          <DataInput
          required={true}
          text="Model name"
          id="name"
          placeholder="Enter name"
          value={name}
          onChange={this.onChange}
          name="name"/>

          <DataInput
          text="Tags"
          id="tags"
          placeholder="Enter tags (separate by comma)"
          value={tags}
          onChange={this.onChange}
          name="tags"/>

          <div className="section item-image-select-section">
            {/* File input */}
            {/* imageSelectsOpen checks how many image selects are open */}

            {[...Array(imageSelectsOpen)].map((e, i) => (
              <div key={i}>
                <ImageSelect
                title="Select image"
                index={i}
                placeholder={newImages[i] ? newImages[i].name : null}
                onImageSelect={this.onImageSelect}
                preview={imagePreviews[i]}/>
              </div>
            ))}

            {/* button to open more image selects (disappears after 2)*/}
            {imageSelectsOpen < 3 && (
              <button 
              className="btn btn-info btn-round"
              onClick={e => this.onAddImageSelect(e)}>
                +
              </button>
            )}
            {/* button to close image selects appears after 1 */}
            {imageSelectsOpen > 1 && (
              <button 
              className="btn btn-danger btn-round"
              onClick={e => this.onRemoveImageSelect(e)}>
                -
              </button>
            )}

          </div>

          <DataInput
          text="Sku nr"
          id="sku"
          placeholder="Enter number"
          value={sku}
          onChange={this.onChange}
          name="sku"/>

          <div className="section">

            <p>Unit Price</p>

            <DataInputSm
            text="USD $"
            required={true}
            id="unit-price-usd"
            value={unitPriceUSD}
            onChange={this.onChange}
            name="unitPriceUSD"/>

            <DataInputSm
            text="RMB"
            id="unit-price-rmb"
            value={unitPriceRMB}
            onChange={this.onChange}
            name="unitPriceRMB"/>

          </div>

          <div className="section">
            <p><strong>Product info</strong></p>

            <DataInput
            text="Color"
            id="color"
            placeholder="Enter color"
            value={color}
            onChange={this.onChange}
            name="color"/>

            <DataInput
            text="Overall dimensions"
            id="overall-dim"
            placeholder="Enter dimensions"
            value={overallDim}
            onChange={this.onChange}
            name="overallDim"/>

            <DataInput
            text="MOQ"
            id="ExampleInputName12"
            placeholder="Enter MOQ"
            value={MOQ}
            onChange={this.onChange}
            name="MOQ"/>
            
          </div>

          <CustomMultiSelect
          text="Part of collection(s)"
          id="collection1"
          name="collectionNames"
          selectedArr={collectionNames}
          options={collections}
          onChange={this.onMultiSelectChange}/>

          <CustomDropDown
          text="Select vendor"
          id="vendor"
          name="vendor"
          value={vendor}
          options={vendors}
          onChange={this.onChange}/>

          <div className="section">
            <p><strong>Packing info</strong></p>
            <p>Qty/ctns</p>

            <DataInput
            text="Shrink"
            id="shrink-qtyctn"
            value={shrinkQTYCTN}
            onChange={this.onChange}
            name="shrinkQTYCTN"/>

            <DataInput
            text="PP Plastic"
            id="pp-qtyctn"
            value={ppQTYCTN}
            onChange={this.onChange}
            name="ppQTYCTN"/>

            <DataInput
            text="Display"
            id="display-qtyctn"
            value={displayQTYCTN}
            onChange={this.onChange}
            name="displayQTYCTN"/>

          </div>

          <div className="section packing-dimensions-table">

            <p>Dimensions</p>

            <PackingDimensionsTable
            shrinkH={shrinkH}
            shrinkW={shrinkW}
            shrinkD={shrinkD}
            ppH={ppH}
            ppW={ppW}
            ppD={ppD}
            displayH={displayH}
            displayW={displayW}
            displayD={displayD}
            onChange={this.onChange}
            />
          </div>


          <TextArea
          text="Notes"
          id="ExampleInputName19"
          placeholder="Enter notes"
          value={notes}
          onChange={this.onChange}
          name="notes"/>

          {/* prompt for when item gets deleted */}
          {isPrompt && (
            <Prompt
            text={'Are you sure you want to delete ' +  name}
            onBack={this.onClosePanel}
            onConfirm={this.remove}
            />
          )}

          <div className="footer-buttons">
            {/* To make the difference between new item and item that is being edited */}
            {isEdit && (
              <>
                <button 
                className="btn btn-primary"
                onClick={e => this.update(e)}>
                  Update
                </button>

                <button 
                className="btn btn-danger"
                onClick={e => this.onOpenPanel(e)}>
                  Delete
                </button>
              </>
          )}
          {!isEdit && (
            <button 
            className="btn btn-danger"
            onClick={e => this.create(e)}>Create</button>
          )}

          <button 
          className="btn btn-default"
          onClick={() => this.props.history.push('/manage-items')}>
            Back
          </button>
        </div>
        </form>
      </>
    )
  }
}

ItemInput.propTypes = {
  itemName: propTypes.string
}

export default withRouter(ItemInput);