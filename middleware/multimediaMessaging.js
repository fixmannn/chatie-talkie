const multer = require('multer');

const multimediaMessaging = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let destinationFolder = 'uploads/';

      if (file.mimetype == 'application/pdf') destinationFolder += 'pdf/';
      if (file.mimetype.startsWith('image/')) destinationFolder += 'images/';
      if (file.mimetype.startsWith('video/')) destinationFolder += 'videos/';
      if (
        file.mimetype == 'application/msword' ||
        file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype == 'application/vnd.ms-excel' ||
        file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype == 'application/vnd.ms-powerpoint'
      ) destinationFolder += 'documents/';

      cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
      const originalName = file.originalname;
      const extension = originalName.substring(originalName.lastIndexOf('.'));
      const newFileName = 'chatietalkie';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
      cb(null, newFileName + '-' + uniqueSuffix + extension);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (
    file.mimetype == 'application/pdf' || 
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype == 'application/msword' ||
    file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype == 'application/vnd.ms-excel' ||
    file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype == 'application/vnd.ms-powerpoint'
    ) {
      cb (null, true)
    } else {
      const error = new Error('File is not supported');
      error.status = 400;
      cb(error.message);
    }
  }

  const maxSize = 64 * 1024 * 1024;
  
  const upload = multer({
    storage: storage, 
    fileFilter,
    limits: {
      fileSize: maxSize
    }
  });
  
  return upload.single('content');
}

module.exports = {multimediaMessaging};