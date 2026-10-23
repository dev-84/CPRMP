
const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleAuthorization');

const {
  createProfile,
  getProfile,
  updateProfile,
  uploadMarksheet,
  previewMarksheet,
} = require('../controllers/studentProfileController');

const {
  handleGetDashboard,
  handleGetDrives,
  handleGetDriveById,
  handleApplyDrive,
  handleGetApplications,
  handleGetApplicationById,
  handleGetAIMatching,
  handleGetPlacementHistory,
} = require('../controllers/studentController');

const { uploadMarksheetMiddleware } = require('../middleware/marksheetUpload');

const {
  rejectUnknownProfileFields,
  validateCreateProfile,
  validateUpdateProfile,
  handleProfileValidationErrors,
} = require('../validators/studentProfileValidators');

const router = express.Router();

// Every student profile route requires authentication and the student role.
router.use(authMiddleware);
router.use(authorizeRoles('student'));

// 1. Student Dashboard: GET /api/student/dashboard
router.get('/dashboard', handleGetDashboard);

// 2. Student Profile: GET, POST, PATCH, PUT /api/student/profile
router.get('/profile', getProfile);

router.post(
  '/profile',
  rejectUnknownProfileFields,
  validateCreateProfile,
  handleProfileValidationErrors,
  createProfile
);

router.patch(
  '/profile',
  rejectUnknownProfileFields,
  validateUpdateProfile,
  handleProfileValidationErrors,
  updateProfile
);

router.put(
  '/profile',
  rejectUnknownProfileFields,
  validateUpdateProfile,
  handleProfileValidationErrors,
  updateProfile
);

// Profile sub-paths for consistency
router.get('/profile/academics', getProfile);
router.get('/profile/contact', getProfile);
router.get('/profile/skills', getProfile);
router.get('/profile/projects', getProfile);

// 3. Marksheet upload & preview
router.post(
  '/profile/marksheet/:qualId',
  uploadMarksheetMiddleware,
  uploadMarksheet
);

router.get('/profile/marksheet/:qualId', previewMarksheet);

// 4. Placement Drives for Students
router.get('/drives', handleGetDrives);
router.get('/drives/:id', handleGetDriveById);
router.post('/drives/:id/apply', handleApplyDrive);

// 5. My Applications
router.get('/applications', handleGetApplications);
router.get('/applications/:id', handleGetApplicationById);

// 6. AI Placement Matching
router.get('/ai-matching', handleGetAIMatching);

// 7. Official Placement History
router.get('/placement-history', handleGetPlacementHistory);

module.exports = router;

