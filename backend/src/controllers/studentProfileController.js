
const {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  uploadMarksheet: uploadMarksheetService,
  getMarksheetFile: getMarksheetFileService,
} = require('../services/studentProfileService');

async function createProfile(req, res) {
  const profile = await createStudentProfile(req.user.id, req.body);

  return res.status(201).json({
    status: 'success',
    message: 'Student profile created successfully',
    data: { profile },
  });
}

async function getProfile(req, res) {
  const profile = await getStudentProfile(req.user.id);

  return res.status(200).json({
    status: 'success',
    message: 'Student profile retrieved successfully',
    data: { profile },
  });
}

async function updateProfile(req, res) {
  const profile = await updateStudentProfile(req.user.id, req.body);

  return res.status(200).json({
    status: 'success',
    message: 'Student profile updated successfully',
    data: { profile },
  });
}

async function uploadMarksheet(req, res) {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a valid marksheet file (PDF, PNG, JPG)',
    });
  }

  const profile = await uploadMarksheetService(
    req.user.id,
    req.params.qualId,
    req.file
  );

  return res.status(200).json({
    status: 'success',
    message: 'Marksheet uploaded successfully',
    data: { profile },
  });
}

async function previewMarksheet(req, res) {
  const { filePath, mimeType, originalName } = await getMarksheetFileService(
    req.user.id,
    req.params.qualId
  );

  res.setHeader('Content-Type', mimeType);
  res.setHeader(
    'Content-Disposition',
    `inline; filename="${encodeURIComponent(originalName)}"`
  );

  return res.sendFile(filePath);
}

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  uploadMarksheet,
  previewMarksheet,
};
