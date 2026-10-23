const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const PlacementDrive = require('../models/PlacementDrive');
const Resume = require('../models/Resume');
const { RESUME_DIR } = require('../middleware/resumeUpload');

function createError(message, statusCode, code = undefined) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (code) error.code = code;
  return error;
}

/**
 * Apply to Placement Drive with Mandatory Resume Verification
 */
async function applyToPlacementDrive({ studentUserId, driveId }) {
  // 1. Verify student profile
  const studentProfile = await StudentProfile.findOne({ userId: studentUserId });
  if (!studentProfile) {
    throw createError(
      'You must complete your student academic profile before applying to placement drives.',
      400
    );
  }

  // 2. MANDATORY RESUME VERIFICATION: Enforce on server
  const activeResume = await Resume.findOne({
    studentProfileId: studentProfile._id,
    isActive: true,
  }).sort({ uploadedAt: -1 });

  if (!activeResume) {
    throw createError(
      'Resume upload is required. Please upload your resume in Resume Management before applying.',
      400,
      'RESUME_REQUIRED'
    );
  }

  // Verify stored file exists and is intact
  const safeFilename = path.basename(activeResume.storageKey);
  const filePath = path.join(RESUME_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    throw createError(
      'Your uploaded resume file is unavailable or missing on the server. Please re-upload your resume to continue.',
      400,
      'RESUME_MISSING_ON_DISK'
    );
  }

  // 3. Resolve placement drive if valid ObjectId
  let drive = null;
  if (mongoose.isValidObjectId(driveId)) {
    drive = await PlacementDrive.findById(driveId);
  }

  // 4. Duplicate application check
  if (drive) {
    const existing = await Application.findOne({
      studentProfileId: studentProfile._id,
      placementDriveId: drive._id,
    });

    if (existing) {
      throw createError(
        'You have already submitted an application for this placement drive.',
        400,
        'DUPLICATE_APPLICATION'
      );
    }
  }

  // 5. Create application record linked to the verified resume
  const newApp = await Application.create({
    studentProfileId: studentProfile._id,
    placementDriveId: drive ? drive._id : new mongoose.Types.ObjectId(),
    resumeId: activeResume._id,
    status: 'submitted',
    eligibilityStatus: 'eligible',
    appliedAt: new Date(),
  });

  return {
    application: newApp,
    resume: {
      id: activeResume._id,
      filename: activeResume.originalFilename,
    },
  };
}

/**
 * Retrieve all applications submitted by the authenticated student
 */
async function getStudentApplications(studentUserId) {
  const studentProfile = await StudentProfile.findOne({ userId: studentUserId });
  if (!studentProfile) return [];

  const apps = await Application.find({ studentProfileId: studentProfile._id })
    .populate('resumeId', 'originalFilename sizeBytes uploadedAt')
    .sort({ appliedAt: -1 })
    .lean();

  return apps;
}

module.exports = {
  applyToPlacementDrive,
  getStudentApplications,
};
