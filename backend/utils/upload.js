const multer = require('multer');
const path = require('path');
const os = require('os');

// For images, we can use a temporary directory since Flask will process them
const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// For videos, we want to save them to the correct input directory
const videoStorage = multer.diskStorage({
  destination(req, file, cb) {
    // Determine the directory based on session ID (we'll set this dynamically or save to a temp dir then move)
    // To keep it simple, save to a general inputs dir, then we can move it
    const inputsPath = path.resolve(__dirname, '../../inputs');
    cb(null, inputsPath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadImages = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { uploadImages, uploadVideo };
