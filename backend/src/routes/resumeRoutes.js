const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleAuthorization');
const { uploadResumeMiddleware } = require('../middleware/resumeUpload');
const {
  handleGetResumeStatus,
  handleUploadResume,
  handlePreviewResume,
  handleDownloadResume,
  handleDeleteResume,
} = require('../controllers/resumeController');

const router = express.Router();

// Require authentication for all resume operations
router.use(authMiddleware);

// Active resume status and listing for student
router.get('/', authorizeRoles('student', 'admin'), handleGetResumeStatus);

// Active resume inline preview
router.get('/preview', authorizeRoles('student', 'admin'), handlePreviewResume);

// Active resume attachment download
router.get('/download', authorizeRoles('student', 'admin'), handleDownloadResume);

// Upload or replace resume
router.post(
  '/',
  authorizeRoles('student'),
  uploadResumeMiddleware,
  handleUploadResume
);

// Preview specific resume by ID (allowed for student owner, admin, or reviewing recruiter)
router.get('/:id/preview', handlePreviewResume);

// Download specific resume by ID
router.get('/:id/download', handleDownloadResume);

// Delete archived resume by ID
router.delete('/:id', authorizeRoles('student', 'admin'), handleDeleteResume);

module.exports = router;
