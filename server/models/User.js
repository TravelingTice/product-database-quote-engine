const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
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
  role: {
    type: String,
    default: ''
  },
  businessCard: {
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

// password hashing
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
