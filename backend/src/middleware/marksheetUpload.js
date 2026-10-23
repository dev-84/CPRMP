const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const UPLOAD_ROOT = path.resolve(__dirname, '../../uploads');
const MARKSHEET_DIR = path.join(UPLOAD_ROOT, 'marksheets');

// Ensure upload directory exists
if (!fs.existsSync(MARKSHEET_DIR)) {
  fs.mkdirSync(MARKSHEET_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, MARKSHEET_DIR);
  },
  filename: function (req, file, cb) {
    const randomHex = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.pdf', '.png', '.jpg', '.jpeg'].includes(ext) ? ext : '.pdf';
    const filename = `marksheet-${Date.now()}-${randomHex}${safeExt}`;
    cb(null, filename);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg'];
  const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

  if (!allowedExts.includes(ext) || !allowedMimes.includes(file.mimetype)) {
    const error = new Error('Only PDF and image marksheets (PNG, JPG) are accepted');
    error.statusCode = 400;
    return cb(error, false);
  }

  cb(null, true);
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const uploadMarksheetMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: MAX_SIZE,
    files: 1,
  },
  fileFilter: fileFilter,
}).single('marksheet');

module.exports = {
  uploadMarksheetMiddleware,
  MARKSHEET_DIR,
};
