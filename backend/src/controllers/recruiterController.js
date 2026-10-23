const recruiterService = require('../services/recruiterService');

async function handleGetDashboard(req, res, next) {
  try {
    const data = await recruiterService.getRecruiterDashboard(req.user.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetCompany(req, res, next) {
  try {
    const data = await recruiterService.getRecruiterCompany(req.user.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleUpdateCompany(req, res, next) {
  try {
    const data = await recruiterService.updateRecruiterCompany(req.user.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Company profile updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetDrives(req, res, next) {
  try {
    const { search, status, page, limit } = req.query;
    const data = await recruiterService.getRecruiterDrives(req.user.id, {
      search,
      status,
      page,
      limit,
    });
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
    const data = await recruiterService.getRecruiterDriveById(req.user.id, req.params.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleCreateDrive(req, res, next) {
  try {
    const drive = await recruiterService.createRecruiterDrive(req.user.id, req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Placement drive created successfully',
      data: { drive },
    });
  } catch (error) {
    next(error);
  }
}

async function handleUpdateDrive(req, res, next) {
  try {
    const drive = await recruiterService.updateRecruiterDrive(req.user.id, req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Placement drive updated successfully',
      data: { drive },
    });
  } catch (error) {
    next(error);
  }
}

async function handleUpdateDriveStatus(req, res, next) {
  try {
    const { status } = req.body;
    const drive = await recruiterService.updateRecruiterDriveStatus(req.user.id, req.params.id, status);
    return res.status(200).json({
      status: 'success',
      message: `Placement drive status updated to ${status}`,
      data: { drive },
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetApplicants(req, res, next) {
  try {
    const { driveId, status, search, program, minCgpa, page, limit } = req.query;
    const data = await recruiterService.getRecruiterApplicants(req.user.id, {
      driveId,
      status,
      search,
      program,
      minCgpa,
      page,
      limit,
    });
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetApplicantById(req, res, next) {
  try {
    const data = await recruiterService.getRecruiterApplicantById(req.user.id, req.params.id);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleUpdateApplicantStatus(req, res, next) {
  try {
    const { status, note, interviewRound } = req.body;
    const data = await recruiterService.updateApplicantStatus(req.user.id, req.params.id, {
      status,
      note,
      interviewRound,
    });
    return res.status(200).json({
      status: 'success',
      message: `Applicant status updated to ${status}`,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleBulkUpdateApplicantStatus(req, res, next) {
  try {
    const { applicationIds, status, note } = req.body;
    const data = await recruiterService.bulkUpdateApplicantStatus(req.user.id, {
      applicationIds,
      status,
      note,
    });
    return res.status(200).json({
      status: 'success',
      message: `Bulk status update completed: ${data.updatedCount} candidates updated.`,
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetShortlisting(req, res, next) {
  try {
    const { driveId, search, minCgpa, page, limit } = req.query;
    const data = await recruiterService.getRecruiterShortlistingData(req.user.id, {
      driveId,
      search,
      minCgpa,
      page,
      limit,
    });
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetRecruitmentStatus(req, res, next) {
  try {
    const { driveId } = req.query;
    const data = await recruiterService.getRecruiterPipelineSummary(req.user.id, {
      driveId,
    });
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
};
