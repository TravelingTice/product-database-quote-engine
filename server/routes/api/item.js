// All item amend/create functions are in here
const Item = require('../../models/Item');

// file upload for picture of picture frame
const upload2 = require('../../services/file-upload2');

module.exports = (app) => {
  app.post('/api/item/create', upload2.array('image', 3), (req, res) => {
    const { body } = req;
    const {
      name,
      unitPriceUSD
    } = body;
    // check if required fields are filled in
    if (!name) return res.send({
      success: false,
      message: 'Name cannot be blank'
    });
    if (!unitPriceUSD) return res.send({
      success: false,
      message: 'Unit price in USD cannot be blank'
    });
    
    // check if item already exists
    Item.find({
      name,
      isDeleted: false
    }, (err, items) => {
      if (err) return res.send({
        success: false,
        message: 'There was an error: ' + err
      });
      if (items.length > 0) return res.send({
        success: false,
        message: 'Item name already exists'
      });

      // make locations array for input in the database
      const locationsArr = [];
      req.files.forEach(file => {
        locationsArr.push(file.Location);
      });

      // save item
      let newItem = new Item({
        ...body,
        // if no image is provided, set default image as placeholder
        images: locationsArr.length > 0 ? locationsArr : ['https://pdqe.s3-ap-southeast-1.amazonaws.com/default.jpg']
      });
      
      newItem.save((err, item) => {
        if (err) return res.send({
          success: false,
          message: 'Error: ' + err
        });
        if (item) return res.send({
          success: true,
          message: 'Item is saved, name: ' + name
        });
      });
    });
  });

  app.put('/api/item/update', upload2.array('image'), (req, res) => {
    const { body } = req;
    const {
      _id,
      name,
      images,
      imagePreviewsAmnt,
      unitPriceUSD
    } = body;
    if (!name) return res.send({
      success: false,
      message: 'Name cannot be blank'
    });
    if (!unitPriceUSD) return res.send({
      success: false,
      message: 'Unit price in USD cannot be blank'
    });

    // make locations array of images for input in the database
    // get old image urls
    Item.find({
      _id,
      isDeleted: false
    }, (err, items) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      // what we're doing here is updating the locations array in the database with urls. The difference is that sometimes a pic is ADDED, sometimes it is OVERWRITTEN (first we also check if it is REMOVED), we control that using the index and checking if the images that is being passed by body has a 'null' entry, which means we have to leave the old one in.
      const locationsArr = items[0].images
      // create array of inputted images this time
      let string = images.replace('[', '');
      string = string.replace(']', '');
      const inputArr = string.split(',');

      // check if an image has been REMOVED
      console.log(imagePreviewsAmnt, locationsArr.length);
      if (imagePreviewsAmnt < locationsArr.length) {
        const amntRemoved = locationsArr.length - imagePreviewsAmnt;
        for (let _i = 0; _i < amntRemoved; _i++) {
          locationsArr.pop();
        }
      }

      let index = 0;

      inputArr.forEach((img, i) => {
        if (img === '{}') {
          locationsArr.splice(i, 1, req.files[index].Location);
        } else {
          index -= 1
        }
        index += 1
      });

      Item.updateOne({
        _id,
        isDeleted: false
      }, { $set: {
        ...body,
        images: locationsArr
      } }, (err, docs) => {
        if (err) return res.send({
          success: false,
          message: 'Server error ' + err
        });
        return res.send({
          success: true,
          message: 'Item updated'
        });
      });
    });
  });

  app.get('/api/item/delete', (req, res) => {
    const { query } = req;
    const { name } = query;

    Item.updateOne({
      name,
      isDeleted: false
    }, {
      $set: { isDeleted: true }
    }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Item deleted'
      });
    });
  });

  app.get('/api/item/deleteByID', (req, res) => {
    const { query } = req;
    const { id } = query;

    Item.updateOne({
      _id: id,
      isDeleted: false
    }, {
      $set: { isDeleted: true }
    }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Item deleted'
      });
    });
  });

  app.get('/api/items', (req, res) => {
    const { headers } = req;
    const { options } = headers;
    const obj = JSON.parse(options);
    if (obj.excludeIfPartOfCollection) {
      Item.find({ isDeleted: false, collectionName: ""}, (err, items) => {
        if (err) return res.send({
          success: false,
          message: 'Server error ' + err
        });
        return res.send({
          success: true,
          message: 'Items fetched',
          items
        });
      });
    } else {
      Item.find({ isDeleted: false }, (err, items) => {
        if (err) return res.send({
          success: false,
          message: 'Server error ' + err
        });
        return res.send({
          success: true,
          message: 'Items fetched',
          items
        });
      });
    }
  });

  app.get('/api/item', (req, res) => {
    const { query } = req;
    const { name } = query;

    Item.find({
      name,
      isDeleted: false
    }, (err, items) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Item fetched',
        item: items[0]
      });
    });
  });

  app.get('/api/item/findByID', (req, res) => {
    const { query } = req;
    const { id } = query;

    Item.find({
      _id: id,
      isDeleted: false
    }, (err, items) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Item fetched',
        item: items[0]
      });
    });
  });

};
