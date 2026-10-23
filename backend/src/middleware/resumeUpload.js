const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const UPLOAD_ROOT = path.resolve(__dirname, '../../uploads');
const RESUME_DIR = path.join(UPLOAD_ROOT, 'resumes');

// Ensure upload directory exists
if (!fs.existsSync(RESUME_DIR)) {
  fs.mkdirSync(RESUME_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, RESUME_DIR);
  },
  filename: function (req, file, cb) {
    const randomHex = crypto.randomBytes(16).toString('hex');
    const safeExt = '.pdf';
    const filename = `resume-${Date.now()}-${randomHex}${safeExt}`;
    cb(null, filename);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const isPdfExt = ext === '.pdf';
  const isPdfMime = file.mimetype === 'application/pdf';

  if (!isPdfExt || !isPdfMime) {
    const error = new Error('Only PDF format resumes are accepted. Please upload a .pdf file.');
    error.statusCode = 415; // Unsupported Media Type
    return cb(error, false);
  }

  cb(null, true);
}

const MAX_SIZE = (parseInt(process.env.MAX_RESUME_SIZE_MB, 10) || 5) * 1024 * 1024; // 5 MB

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_SIZE,
    files: 1,
  },
  fileFilter: fileFilter,
}).single('resume');

/**
 * Express middleware wrapper that intercepts Multer errors
 * and sets proper HTTP status codes (413 for size limit, 415 for type, 400 for bad request)
 */
function uploadResumeMiddleware(req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            status: 'error',
            message: `Resume file exceeds maximum allowed limit of ${MAX_SIZE / (1024 * 1024)} MB`,
          });
        }
        return res.status(400).json({
          status: 'error',
          message: err.message || 'File upload failed',
        });
      }

      const statusCode = err.statusCode || 400;
      return res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Invalid resume file',
      });
    }

    next();
  });
}

module.exports = {
  uploadResumeMiddleware,
  RESUME_DIR,
  MAX_SIZE,
};
