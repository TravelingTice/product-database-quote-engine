const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  user: {
    type: String,
    default: ''
  },
  items: {
      type: Array,
      default: []
  },
  timeStamp: {
    type: String,
    default: ''
  },
  isDeleted: {
      type: Boolean,
      default: false
  }
});

module.exports = mongoose.model('Quote', QuoteSchema);
