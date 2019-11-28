const upload2 = require('../../services/file-upload2');

module.exports = (app) => {
  app.post('/api/upload', upload2.array('image', 1), (req, res) => {

    return res.send({
      success: true,
      message: 'Done',
      file: req.files[0]
    });
  });
};