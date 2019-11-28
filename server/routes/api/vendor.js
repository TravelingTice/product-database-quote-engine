// All customer amend/create functions are in here
const Vendor = require('../../models/Vendor');

// file upload for name card
const upload2 = require('../../services/file-upload2');

module.exports = (app) => {
  app.get('/api/vendors', (req, res) => {
    Vendor.find({ isDeleted: false }, (err, vendors) => {
      if (err) res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Vendors fetched',
        vendors
      });
    });
  });

  app.get('/api/vendors/names', (req, res) => {
    Vendor.find({ isDeleted: false }, (err, vendors) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });

      // make array only with the vendor names values
      const arr = [];
      vendors.forEach(vendor => {
        arr.push(vendor.name);
      });
      return res.send({
        success: true,
        message: 'Vendor names fetched',
        vendorNames: arr
      });
    });
  });

  // find vendor with _id
  app.get('/api/vendor/find', (req, res) => {
    const { query } = req;
    const { id } = query;

    Vendor.find({
      _id: id,
      isDeleted: false
    }, (err, vendors) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      if (vendors.length !== 1) return res.send({
        success: false,
        message: 'No vendors found'
      });
      return res.send({
        success: true,
        message: 'Vendor fetched',
        vendor: vendors[0]
      });
    });
  });

  // create new vendor
  app.post('/api/vendor/create', upload2.array('nameCard', 1), (req, res) => {
    const { body } = req;
    const {
      name,
      email,
      street1,
      city,
      postcode
    } = body;
    if (!name) return res.send({
      success: false,
      message: 'Name cannot be blank'
    });
    if (!email) return res.send({
      success: false,
      message: 'Email cannot be blank'
    });
    if (!street1) return res.send({
      success: false,
      message: 'Address line 1 cannot be blank'
    });
    if (!city) return res.send({
      success: false,
      message: 'City cannot be blank'
    });
    if (!postcode) return res.send({
      success: false,
      message: 'Postal code cannot be blank'
    });
    
    // check if vendor already exists
    Vendor.find({
      name,
      email,
      isDeleted: false
    }, (err, vendors) => {
      if (err) return res.send({
        success: false,
        message: 'There was an error: ' + err
      });
      if (vendors.length > 0) return res.send({
        success: false,
        message: 'Vendor already exists'
      });
      
      // save vendor
      const newVendor = new Vendor({
        ...body
      });

      // check if image has been uploaded
      if (req.files.length >= 1) {
        newVendor.nameCard = req.files[0].Location
      }

      newVendor.save((err, vendor) => {
        if (err) return res.send({
          success: false,
          message: 'Error: ' + err
        });
        if (vendor) return res.send({
          success: true,
          message: 'Vendor is created, name: ' + name
        });
      });
    });
  });

  // update vendor finding it with the _id prop
  app.put('/api/vendor/update', upload2.array('nameCard', 1), (req, res) => {
    const { body } = req;
    const {
      name,
      _id,
      email
    } = body;
    if (!name) return res.send({
      success: false,
      message: 'Name cannot be blank'
    });
    if (!email) return res.send({
      success: false,
      message: 'Email cannot be blank'
    });

    const updatedVendor = body;

    // check if new image has been uploaded
    if (req.files.length >= 1) {
      updatedVendor.nameCard = req.files[0].Location;
    }

    Vendor.updateOne({
      _id,
      isDeleted: false
    }, 
    { $set: { ...updatedVendor } }, { new: true }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Vendor updated'
      });
    });
  });

  app.delete('/api/vendor/delete', (req, res) => {
    const { id } = req.query;

    Vendor.updateOne({
      _id: id,
      isDeleted: false
    }, { $set: { isDeleted: true } }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Vendor deleted'
      });
    });
  });
};
