const multer = require('multer');

const multimediaMessaging = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './assets');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({storage: storage});
  
  return upload.single('content');
}

module.exports = {multimediaMessaging};