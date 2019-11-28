const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
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
 
const upload = multer({
  fileFilter,
  limits: {
    fileSize: 1048576
  },
  storage: multerS3({
    s3,
    bucket: 'pdqe',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: 'TESTING_META_DATA!'});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    }
  })
});

module.exports = upload;