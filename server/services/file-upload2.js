// use this file upload service for resizing the image upon upload to x pixels wide, edit below:

const width = 600;

const aws = require('aws-sdk');
const multer = require('multer');
// special module for resizing upon upload
const s3Storage = require('multer-sharp-s3');

const config = require('../../config/config');

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS,
  accessKeyId: config.AWS_ACCESS_KEY,
  region: 'us-east-2'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb (new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
}

const upload2 = multer({
  fileFilter,
  limits: {
    fileSize: 1048576 * 3
  },
  storage: s3Storage({
    s3,
    Bucket: 'pdqe',
    acl: 'public-read',
    resize: {
      width,
    },
    Key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    }
  })
})

module.exports = upload2;