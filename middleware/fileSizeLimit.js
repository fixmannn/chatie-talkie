const multer = require('multer');


const handleFileSizeLimitExceeded = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size limit exceeded.' });
    }
  }
  next(err);
};

module.exports = {
  handleFileSizeLimitExceeded: handleFileSizeLimitExceeded
};