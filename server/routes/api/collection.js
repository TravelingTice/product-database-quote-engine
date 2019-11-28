// All collection amend/create functions are in here
const Collection = require('../../models/Collection');

module.exports = (app) => {
  app.get('/api/collections', (req, res) => {
    Collection.find({ isDeleted: false }, (err, collections) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Collections fetched',
        collections
      });
    });
  });

  app.get('/api/collections/names', (req, res) => {
    Collection.find({ isDeleted: false }, (err, collections) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      // make array only with the collection names values
      const arr = [];
      collections.forEach(collection => {
        arr.push(collection.name);
      });
      return res.send({
        success: true,
        message: 'Collection names fetched',
        collectionNames: arr
      });
    });
  });
  
  app.post('/api/collection/create', (req, res) => {
    const { body } = req;
    const { name } = body;
  
    // check if name is not blank
    if (!name) return res.send({
      success: false,
      message: 'Name cannot be blank'
    });
  
    // check if collection doesnt exist already
    Collection.find({
      name,
      isDeleted: false
    }, (err, collections) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      if (collections.length > 0) return res.send({
        success: false,
        message: 'Collection already exists'
      });
      
      const newCollection = new Collection({
        name
      });
  
      newCollection.save((err, collection) => {
        if (err) return res.send({
          success: false,
          message: 'Server error ' + err
        });
        return res.send({
          success: true,
          message: 'Collection created'
        });
      });
    });
  });
  
  app.get('/api/collection', (req, res) => {
    const { query } = req;
    const { name } = query;
  
    Collection.find({
      name,
      isDeleted: false
    }, (err, collections) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Collections fetched',
        collections
      });
    });
  });
  
  app.get('/api/collection/delete', (req, res) => {
    const { query } = req;
    const { name } = query;
    // 2 steps: 1: delete collection, 2: clear collectionName properties of all items with this collection name
    Collection.updateOne({ name, isDeleted: false }, {
      $set: { isDeleted: true }
    }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      // TODO: find all items with this collection name and update them
      return res.send({
        success: true,
        message: 'Collection deleted'
      });
    });
  });

  app.get('/api/collection/deleteByID', (req, res) => {
    const { query } = req;
    const { id } = query;
    // 2 steps: 1: delete collection, 2: clear collectionName properties of all items with this collection name
    Collection.updateOne({ _id: id, isDeleted: false }, {
      $set: { isDeleted: true }
    }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      // TODO: find all items with this collection name and update them
      return res.send({
        success: true,
        message: 'Collection deleted'
      });
    });
  });
};