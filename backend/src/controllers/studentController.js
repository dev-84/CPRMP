const {
  getStudentDashboardData,
  getStudentDrivesList,
  getStudentDriveById,
  applyToDriveForStudent,
  getStudentApplications,
  getStudentApplicationDetails,
  getStudentAIMatching,
  getStudentPlacementHistory,
} = require('../services/studentService');

async function handleGetDashboard(req, res, next) {
  try {
    const data = await getStudentDashboardData(req.user.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetDrives(req, res, next) {
  try {
    const data = await getStudentDrivesList(req.user.id, req.query);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetDriveById(req, res, next) {
  try {
    const data = await getStudentDriveById(req.user.id, req.params.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleApplyDrive(req, res, next) {
  try {
    const driveId = req.params.id || req.body.driveId;
    const result = await applyToDriveForStudent(req.user.id, driveId);
    return res.status(201).json({
      status: 'success',
      message: result.message || 'Application submitted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetApplications(req, res, next) {
  try {
    const data = await getStudentApplications(req.user.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetApplicationById(req, res, next) {
  try {
    const data = await getStudentApplicationDetails(req.user.id, req.params.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetAIMatching(req, res, next) {
  try {
    const data = await getStudentAIMatching(req.user.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetPlacementHistory(req, res, next) {
  try {
    const data = await getStudentPlacementHistory(req.user.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleGetDashboard,
  handleGetDrives,
  handleGetDriveById,
  handleApplyDrive,
  handleGetApplications,
  handleGetApplicationById,
  handleGetAIMatching,
  handleGetPlacementHistory,
};
