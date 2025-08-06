const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: path.join(__dirname, '..', 'uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, callback) => {
    if (file.mimetype === 'text/plain') {
      callback(null, true);
    } else {
      callback(new Error('Apenas arquivos .txt são permitidos'));
    }
  }
});

module.exports = upload;
