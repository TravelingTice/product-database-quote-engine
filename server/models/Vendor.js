const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  contactPerson: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  street1: {
    type: String,
    default: ''
  },
  street2: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  postcode: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  nameCard: {
    type: String,
    default: 'https://pdqe.s3-ap-southeast-1.amazonaws.com/default.jpg'
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

module.exports = mongoose.model('Vendor', VendorSchema);
