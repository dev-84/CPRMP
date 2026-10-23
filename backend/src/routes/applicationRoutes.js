const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleAuthorization');
const {
  handleApplyToDrive,
  handleGetMyApplications,
  handleGetApplicationDetails,
} = require('../controllers/applicationController');

const router = express.Router();

router.use(authMiddleware);

// Student apply to drive (enforces mandatory verified resume on backend)
router.post('/apply', authorizeRoles('student'), handleApplyToDrive);
router.post('/apply/:driveId', authorizeRoles('student'), handleApplyToDrive);

// Get student applications
router.get('/me', authorizeRoles('student'), handleGetMyApplications);
router.get('/', authorizeRoles('student'), handleGetMyApplications);
router.get('/:id', authorizeRoles('student'), handleGetApplicationDetails);

module.exports = router;

