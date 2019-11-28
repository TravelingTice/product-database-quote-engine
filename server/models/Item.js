const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    default: ''
  },
  images: {
    type: Array,
    default: ['https://pdqe.s3-ap-southeast-1.amazonaws.com/default.jpg']
  },
  tags: {
    type: String,
    default: ''
  },
  unitPriceUSD: {
    type: Number,
    default: 0
  },
  unitPriceRMB: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: ''
  },
  overallDim: {
    type: String,
    default: ''
  },
  MOQ: {
    type: Number,
    default: 0
  },
  shrinkQTYCTN: {
    type: Number,
    default: 0
  },
  shrinkH: {
    type: Number,
    default: 0
  },
  shrinkW: {
    type: Number,
    default: 0
  },
  shrinkD: {
    type: Number,
    default: 0
  },
  ppQTYCTN: {
    type: Number,
    default: 0
  },
  ppH: {
    type: Number,
    default: 0
  },
  ppW: {
    type: Number,
    default: 0
  },
  ppD: {
    type: Number,
    default: 0
  },
  displayQTYCTN: {
    type: Number,
    default: 0
  },
  displayH: {
    type: Number,
    default: 0
  },
  displayW: {
    type: Number,
    default: 0
  },
  displayD: {
    type: Number,
    default: 0
  },
  collectionNames: {
    type: Array,
    default: []
  },
  vendor: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Item', ItemSchema);
