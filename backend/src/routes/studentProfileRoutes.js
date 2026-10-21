
const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleAuthorization');

const {
  createProfile,
  getProfile,
  updateProfile,
} = require('../controllers/studentProfileController');

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

// GET /api/student/profile
router.get('/profile', getProfile);

// POST /api/student/profile
router.post(
  '/profile',
  rejectUnknownProfileFields,
  validateCreateProfile,
  handleProfileValidationErrors,
  createProfile
);

// PATCH /api/student/profile
router.patch(
  '/profile',
  rejectUnknownProfileFields,
  validateUpdateProfile,
  handleProfileValidationErrors,
  updateProfile
);

module.exports = router;
