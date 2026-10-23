const adminService = require('../services/adminService');

// 1. Dashboard
async function handleGetDashboardStats(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    return res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetRecentActivity(req, res, next) {
  try {
    const activity = await adminService.getRecentActivity();
    return res.status(200).json({
      status: 'success',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetUpcomingDrives(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const drives = await adminService.getUpcomingDrives(limit);
    return res.status(200).json({
      status: 'success',
      data: drives,
    });
  } catch (error) {
    next(error);
  }
}

// 2. Students
async function handleGetStudents(req, res, next) {
  try {
    const result = await adminService.getStudents(req.query);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetStudentById(req, res, next) {
  try {
    const student = await adminService.getStudentById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: student,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
}

async function handleUpdateStudentVerification(req, res, next) {
  try {
    const updated = await adminService.updateStudentVerification(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Student verification updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
}

// 3. Recruiters
async function handleGetRecruiters(req, res, next) {
  try {
    const result = await adminService.getRecruiters(req.query);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function handleCreateRecruiter(req, res, next) {
  try {
    const result = await adminService.createRecruiter(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Recruiter account created successfully',
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
}

async function handleUpdateRecruiter(req, res, next) {
  try {
    const updated = await adminService.updateRecruiter(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Recruiter updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
}

// 4. Placement Drives
async function handleGetDrives(req, res, next) {
  try {
    const result = await adminService.getDrives(req.query);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function handleCreateDrive(req, res, next) {
  try {
    const adminUserId = req.user?.id;
    const result = await adminService.createDrive(req.body, adminUserId);
    return res.status(201).json({
      status: 'success',
      message: 'Placement drive created successfully',
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
}

async function handleUpdateDrive(req, res, next) {
  try {
    const updated = await adminService.updateDrive(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Placement drive updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ status: 'error', message: error.message });
    }
    next(error);
  }
}

// 5. Companies List
async function handleGetCompanies(req, res, next) {
  try {
    const companies = await adminService.getCompaniesList();
    return res.status(200).json({
      status: 'success',
      data: companies,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
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
};
