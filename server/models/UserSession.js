const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now()
  },
  role: {
    type: String,
    default: 'salesrep'
  },
  isDeleted: {
      type: Boolean,
      default: false
  }
});

module.exports = mongoose.model('UserSession', UserSessionSchema);
