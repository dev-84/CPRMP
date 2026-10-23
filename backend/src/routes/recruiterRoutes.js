const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleAuthorization');
const {
  handleGetDashboard,
  handleGetCompany,
  handleUpdateCompany,
  handleGetDrives,
  handleGetDriveById,
  handleCreateDrive,
  handleUpdateDrive,
  handleUpdateDriveStatus,
  handleGetApplicants,
  handleGetApplicantById,
  handleUpdateApplicantStatus,
  handleBulkUpdateApplicantStatus,
  handleGetShortlisting,
  handleGetRecruitmentStatus,
} = require('../controllers/recruiterController');

const router = express.Router();

// Enforce authentication & Recruiter role across all endpoints
router.use(authMiddleware);
router.use(authorizeRoles('recruiter'));

// 1. Dashboard
router.get('/dashboard', handleGetDashboard);

// 2. Company Profile
router.get('/company', handleGetCompany);
router.patch('/company', handleUpdateCompany);

// 3. Placement Drives
router.get('/drives', handleGetDrives);
router.post('/drives', handleCreateDrive);
router.get('/drives/:id', handleGetDriveById);
router.patch('/drives/:id', handleUpdateDrive);
router.patch('/drives/:id/status', handleUpdateDriveStatus);

// 4. Applicants
router.get('/applicants', handleGetApplicants);
router.get('/applicants/:id', handleGetApplicantById);
router.patch('/applicants/:id/status', handleUpdateApplicantStatus);
router.post('/applicants/bulk-status', handleBulkUpdateApplicantStatus);

// 5. Shortlisting Workspace
router.get('/shortlisting', handleGetShortlisting);

// 6. Recruitment Status & Pipeline
router.get('/recruitment-status', handleGetRecruitmentStatus);

module.exports = router;
