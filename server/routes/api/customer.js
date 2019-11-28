// All customer amend/create functions are in here
const Customer = require('../../models/Customer');

// file upload for businesscard
const upload2 = require('../../services/file-upload2');

module.exports = (app) => {
  app.get('/api/customers', (req, res) => {
    Customer.find({ isDeleted: false }, (err, customers) => {
      if (err) res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Customers fetched',
        customers
      })
    });
  });

  app.get('/api/customer/find', (req, res) => {
    const { query } = req;
    const { name } = query;

    Customer.find({
      name,
      isDeleted: false
    }, (err, customers) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Customer fetched',
        customer: customers[0]
      });
    });
  });

  app.get('/api/customer/findByID', (req, res) => {
    const { query } = req;
    const { id } = query;

    Customer.find({
      _id: id,
      isDeleted: false
    }, (err, customers) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Customer fetched',
        customer: customers[0]
      });
    });
  });

  app.get('/api/customer/findFromUser', (req, res) => {
    const { user } = req.query;
    if (!user) return res.send({
      success: false,
      message: 'Something went wrong ' + err
    });
    Customer.find({ user, isDeleted: false }, (err, customers) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Customers found',
        customers
      });
    });
  });

  app.post('/api/customer/create', upload2.array('businessCard', 1), (req, res) => {
    const { body } = req;
    const {
      name,
      email,
      user
    } = body;
    if (!name) return res.send({
      success: false,
      message: 'Name cannot be blank'
    });
    if (!email) return res.send({
      success: false,
      message: 'Email cannot be blank'
    });
    if (!user) return res.send({
      success: false,
      message: 'Something went wrong, try logging in again'
    });
    
    // check if customer already exists for this user
    Customer.find({
      name,
      email,
      user,
      isDeleted: false
    }, (err, customers) => {
      if (err) return res.send({
        success: false,
        message: 'There was an error: ' + err
      });
      if (customers.length > 0) return res.send({
        success: false,
        message: 'Customer already exists'
      });

      // save item
      const newCustomer = new Customer({
        ...body
      });
      // check if an image is uploaded, if so set the location prop to businessCard
      if (req.files.length >= 1) {
        newCustomer.businessCard = req.files[0].Location
      }
      newCustomer.save((err, customer) => {
        if (err) return res.send({
          success: false,
          message: 'Error: ' + err
        });
        if (customer) return res.send({
          success: true,
          message: 'Customer is created, name: ' + name
        });
      });
    });
  });

  app.put('/api/customer/update', upload2.array('businessCard', 1), (req, res) => {
    const { body } = req;
    const {
      _id,
      name,
      email,
      user
    } = body;
    if (!name) return res.send({
      success: false,
      message: 'Name cannot be blank'
    });
    if (!email) return res.send({
      success: false,
      message: 'Email cannot be blank'
    });
    if (!user) return res.send({
      success: false,
      message: 'Something went wrong, try logging in again'
    });

    const updatedCustomer = body;

    // check if a new business card image has been uploaded
    if (req.files.length >= 1) {
      updatedCustomer.businessCard = req.files[0].Location;
    }

    Customer.updateOne({
      _id,
      isDeleted: false
    }, { $set: { ...updatedCustomer } }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Customer updated'
      });
    });
  });

  app.delete('/api/customer/remove', (req, res) => {
    const { id } = req.query;

    Customer.updateOne({
      _id: id,
      isDeleted: false
    }, {
      $set: { isDeleted: true }
    }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Error: ' + err
      });
      return res.send({
        success: true,
        message: 'Customer deleted'
      });
    });
  });

};
