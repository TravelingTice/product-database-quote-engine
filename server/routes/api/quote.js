// all add to quote, remove from quote and quote type functions are in here

const Quote = require('../../models/Quote');

module.exports = app => {
  app.get('/api/quote/getQuotes', (req, res) => {
    const { user } = req.query
    Quote.find({ isDeleted: false, user }, (err, quotes) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Quotes fetched',
        quotes
      });
    });
  });

  app.get('/api/quote/getQuote', (req, res) => {
    const { id } = req.query;
    Quote.find({
      _id: id
    }, (err, quotes) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Quote fetched',
        quote: quotes[0]
      });
    });
  });

  app.delete('/api/quote/remove', (req, res) => {
    const { id } = req.query;
    Quote.updateOne({
      _id: id
    }, { $set: { isDeleted: true } }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Item removed'
      });
    });
  });

  app.post('/api/quote/createQuote', (req, res) => {
    const { body } = req;
    const { user, items } = body;

    if (!user) return res.send({
      success: false,
      message: 'Something went wrong, try logging in again'
    });
    if (items.length <= 0) return res.send({
      success: false,
      message: 'No items were selected'
    });

    const newQuote = new Quote();
    newQuote.user = user;
    newQuote.items = items;

    // set timestamp of quote

    const date = new Date();
    const timeStamp = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    newQuote.timeStamp = timeStamp;

    newQuote.save((err, quote) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Quote saved',
        quoteID: quote._id
      });
    });
  });

  app.put('/api/quote/updateQuote', (req, res) => {
    const { items, id } = req.body;
    // if an id is provided for the array update, then we'll have to find the specific quote with this id
    // get quote with provided id
    Quote.updateOne({ isDeleted: false, _id: id }, {
      $set: { items }
    }, (err, docs) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      return res.send({
        success: true,
        message: 'Quote updated'
      });
    });
  });

  app.put('/api/quote/removeFromQuote', (req, res) => {
    const { itemsToBeDeleted, id } = req.body;
    // if an id is provided for the name removal, then we'll have to find the specific quote with this id
    Quote.find({ isDeleted: false, _id: id }, (err, quotes) => {
      if (err) return res.send({
        success: false,
        message: 'Server error ' + err
      });
      // so we take the specific quote here
      const thisQuote = quotes[0];
      // update this specific quote with the removed items
      const items = [];
      thisQuote.items.forEach(item => {
        // indicator to check if item is indeed in the toBeDeleted list
        let bool = false;
        itemsToBeDeleted.forEach(itemToBeDeleted => {
          if (item.name === itemToBeDeleted.name) {
            bool = true;
          }
        });
        if (!bool) {
          items.push(item);
        }
      });
      
      // Update the quote in the DB
      Quote.updateOne({
        _id: id,
        isDeleted: false
      }, { $set: { items } }, (err, docs) => {
        if (err) return res.send({
          success: false,
          message: 'Server error ' + err
        });
        return res.send({
          success: true,
          message: 'Items deleted from specific quote'
        });
      });
    });
  });
}