const {
  applyToPlacementDrive,
  getStudentApplications,
} = require('../services/applicationService');
const { getStudentApplicationDetails } = require('../services/studentService');

async function handleApplyToDrive(req, res, next) {
  try {
    const { driveId } = req.body;
    const result = await applyToPlacementDrive({
      studentUserId: req.user.id,
      driveId: driveId || req.params.driveId || req.params.id,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully with verified resume',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetMyApplications(req, res, next) {
  try {
    const data = await getStudentApplications(req.user.id);
    return res.status(200).json({
      status: 'success',
      data: Array.isArray(data) ? { applications: data } : data,
    });
  } catch (error) {
    next(error);
  }
}


async function handleGetApplicationDetails(req, res, next) {
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

module.exports = {
  handleApplyToDrive,
  handleGetMyApplications,
  handleGetApplicationDetails,
};

