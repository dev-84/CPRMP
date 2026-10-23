const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleAuthorization');
const {
  handleGetDashboardStats,
  handleGetRecentActivity,
  handleGetUpcomingDrives,
  handleGetStudents,
  handleGetStudentById,
  handleUpdateStudentVerification,
  handleGetRecruiters,
  handleCreateRecruiter,
  handleUpdateRecruiter,
  handleGetDrives,
  handleCreateDrive,
  handleUpdateDrive,
  handleGetCompanies,
} = require('../controllers/adminController');

const router = express.Router();

// Enforce authentication & ADMIN role for all administrative endpoints
router.use(authMiddleware);
router.use(authorizeRoles('admin'));

// 1. Dashboard Endpoints
router.get('/dashboard/stats', handleGetDashboardStats);
router.get('/dashboard/recent-activity', handleGetRecentActivity);
router.get('/dashboard/upcoming-drives', handleGetUpcomingDrives);

// 2. Student Management Endpoints
router.get('/students', handleGetStudents);
router.get('/students/:id', handleGetStudentById);
router.patch('/students/:id/status', handleUpdateStudentVerification);
router.patch('/students/:id/verification', handleUpdateStudentVerification);

// 3. Recruiter Management Endpoints
router.get('/recruiters', handleGetRecruiters);
router.post('/recruiters', handleCreateRecruiter);
router.patch('/recruiters/:id', handleUpdateRecruiter);

// 4. Placement Drive Management Endpoints
router.get('/drives', handleGetDrives);
router.post('/drives', handleCreateDrive);
router.patch('/drives/:id', handleUpdateDrive);
router.patch('/drives/:id/status', handleUpdateDrive);

// 5. Companies Dropdown List
router.get('/companies', handleGetCompanies);

module.exports = router;
