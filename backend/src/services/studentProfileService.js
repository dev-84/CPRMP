
const mongoose = require('mongoose');
const StudentProfile = require('../models/StudentProfile');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

const PROFILE_FIELDS = [
  'studentId',
  'phone',
  'department',
  'degree',
  'graduationYear',
  'currentSemester',
  'cgpa',
  'backlogCount',
  'skills',
];

function toPublicProfile(profile) {
  if (!profile) return null;

  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    studentId: profile.studentId,
    phone: profile.phone,
    department: profile.department,
    degree: profile.degree,
    graduationYear: profile.graduationYear,
    currentSemester: profile.currentSemester,
    cgpa: profile.cgpa,
    backlogCount: profile.backlogCount,
    skills: profile.skills,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

function pickProfileFields(input) {
  const fields = {};

  for (const field of PROFILE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      fields[field] = input[field];
    }
  }

  return fields;
}

function validateUserId(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError('Invalid authenticated user ID', 401);
  }
}

async function createStudentProfile(userId, input) {
  validateUserId(userId);

  const existingProfile = await StudentProfile.findOne({ userId });

  if (existingProfile) {
    throw createError('Student profile already exists', 409);
  }

  try {
    const profile = await StudentProfile.create({
      ...pickProfileFields(input),
      userId,
    });

    return toPublicProfile(profile);
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.studentId || error.keyValue?.studentId) {
        throw createError('This student ID is already in use', 409);
      }

      throw createError('Student profile already exists or conflicts with existing data', 409);
    }

    if (error.name === 'ValidationError' || error.name === 'CastError') {
      throw createError('Student profile data is invalid', 400);
    }

    throw error;
  }
}

async function getStudentProfile(userId) {
  validateUserId(userId);

  const profile = await StudentProfile.findOne({ userId });

  if (!profile) {
    throw createError('Student profile not found', 404);
  }

  return toPublicProfile(profile);
}

async function updateStudentProfile(userId, input) {
  validateUserId(userId);

  const fields = pickProfileFields(input);

  if (Object.keys(fields).length === 0) {
    throw createError('Provide at least one profile field to update', 400);
  }

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: fields },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      throw createError('Student profile not found', 404);
    }

    return toPublicProfile(profile);
  } catch (error) {
    if (error.statusCode) throw error;

    if (error.code === 11000) {
      if (error.keyPattern?.studentId || error.keyValue?.studentId) {
        throw createError('This student ID is already in use', 409);
      }

      throw createError('Student profile conflicts with existing data', 409);
    }

    if (error.name === 'ValidationError' || error.name === 'CastError') {
      throw createError('Student profile data is invalid', 400);
    }

    throw error;
  }
}

module.exports = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
};
