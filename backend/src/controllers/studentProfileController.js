
const {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
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

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};
