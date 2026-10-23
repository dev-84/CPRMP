const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Resume = require('../models/Resume');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const RecruiterProfile = require('../models/RecruiterProfile');
const PlacementDrive = require('../models/PlacementDrive');
const { RESUME_DIR } = require('../middleware/resumeUpload');

function createError(message, statusCode, code = undefined) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (code) error.code = code;
  return error;
}

/**
 * Computes SHA-256 checksum of a file for integrity validation
 */
function computeChecksum(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  } catch {
    return null;
  }
}

/**
 * Helper to ensure student profile exists for the user
 */
async function getOrCreateStudentProfile(userId) {
  let profile = await StudentProfile.findOne({ userId });
  if (!profile) {
    // If student profile does not exist yet, initialize a minimal one
    profile = await StudentProfile.create({
      userId,
      studentId: `STU-${Date.now().toString().slice(-6)}`,
      department: 'Computer Science',
      degree: 'MCA',
      graduationYear: new Date().getFullYear() + 1,
      cgpa: 8.0,
      backlogCount: 0,
    });
  }
  return profile;
}

/**
 * Upload or Replace Student Placement Resume
 */
async function uploadResume(studentUserId, file) {
  if (!file) {
    throw createError('No resume file was uploaded. Please provide a PDF document.', 400);
  }

  // Ensure file is on disk
  if (!file.path || !fs.existsSync(file.path)) {
    throw createError('Uploaded file stream was interrupted. Please try again.', 400);
  }

  const studentProfile = await getOrCreateStudentProfile(studentUserId);

  // Validate file signature: PDF must begin with '%PDF-'
  try {
    const fd = fs.openSync(file.path, 'r');
    const buffer = Buffer.alloc(5);
    fs.readSync(fd, buffer, 0, 5, 0);
    fs.closeSync(fd);

    if (buffer.toString('utf8') !== '%PDF-') {
      try {
        fs.unlinkSync(file.path);
      } catch {}
      throw createError('Uploaded file is not a valid PDF document. Invalid file signature.', 415);
    }
  } catch (err) {
    if (err.statusCode) throw err;
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch {}
    throw createError('Could not verify PDF file signature. Please ensure the file is an uncorrupted PDF.', 400);
  }

  const checksum = computeChecksum(file.path);

  // Sanitize original filename
  const cleanOriginalName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');

  // Deactivate prior active resumes for this candidate so the new upload becomes active
  await Resume.updateMany(
    { studentProfileId: studentProfile._id, isActive: true },
    { $set: { isActive: false } }
  );

  // Create new active Resume document
  const resume = await Resume.create({
    studentProfileId: studentProfile._id,
    originalFilename: cleanOriginalName,
    storageKey: file.filename,
    mimeType: 'application/pdf',
    sizeBytes: file.size,
    checksum,
    isActive: true,
    uploadedAt: new Date(),
  });

  // Keep StudentProfile.resume subdocument synchronized
  await StudentProfile.findByIdAndUpdate(studentProfile._id, {
    $set: {
      resume: {
        filename: cleanOriginalName,
        url: '/api/student/resume/preview',
        fileSize: file.size,
        updatedAt: new Date(),
      },
    },
  });

  return {
    id: resume._id,
    originalFilename: resume.originalFilename,
    filename: resume.originalFilename,
    sizeBytes: resume.sizeBytes,
    fileSize: resume.sizeBytes,
    mimeType: resume.mimeType,
    uploadedAt: resume.uploadedAt,
    status: 'Active & Verified by TPO',
  };
}

/**
 * Retrieve current active resume status & audit archive for the student
 */
async function getResumeStatus(studentUserId) {
  const studentProfile = await StudentProfile.findOne({ userId: studentUserId });
  if (!studentProfile) {
    return {
      hasResume: false,
      resume: null,
      archive: [],
    };
  }

  // Find active resume
  const activeResume = await Resume.findOne({
    studentProfileId: studentProfile._id,
    isActive: true,
  }).sort({ uploadedAt: -1 });

  // Verify that the file actually exists on storage disk
  let validActiveResume = null;
  if (activeResume) {
    const safeFilename = path.basename(activeResume.storageKey);
    const filePath = path.join(RESUME_DIR, safeFilename);

    if (fs.existsSync(filePath)) {
      validActiveResume = {
        id: activeResume._id,
        originalFilename: activeResume.originalFilename,
        filename: activeResume.originalFilename,
        sizeBytes: activeResume.sizeBytes,
        fileSize: activeResume.sizeBytes,
        mimeType: activeResume.mimeType,
        uploadedAt: activeResume.uploadedAt,
        status: 'Active & Verified by TPO',
      };
    } else {
      // File missing on disk - mark inactive
      activeResume.isActive = false;
      await activeResume.save();
    }
  }

  // Retrieve archived resumes
  const archived = await Resume.find({
    studentProfileId: studentProfile._id,
    isActive: false,
  })
    .sort({ uploadedAt: -1 })
    .limit(10)
    .lean();

  const formattedArchive = archived.map((item) => ({
    id: item._id,
    name: item.originalFilename,
    originalFilename: item.originalFilename,
    size: item.sizeBytes,
    sizeBytes: item.sizeBytes,
    date: item.uploadedAt,
    uploadedAt: item.uploadedAt,
  }));

  return {
    hasResume: Boolean(validActiveResume),
    resume: validActiveResume,
    archive: formattedArchive,
  };
}

/**
 * Retrieve file path and metadata for Preview or Download
 * Enforces ownership and path traversal prevention
 */
async function getResumeFile(user, resumeId = null) {
  let resume = null;

  if (resumeId) {
    resume = await Resume.findById(resumeId);
  } else {
    // If no resumeId specified, find the user's active resume
    const studentProfile = await StudentProfile.findOne({ userId: user.id });
    if (studentProfile) {
      resume = await Resume.findOne({
        studentProfileId: studentProfile._id,
        isActive: true,
      }).sort({ uploadedAt: -1 });
    }
  }

  if (!resume) {
    throw createError('No active resume document found. Please upload your resume first.', 404);
  }

  // Authorization check
  if (user.role === 'student') {
    const studentProfile = await StudentProfile.findOne({ userId: user.id });
    if (!studentProfile || resume.studentProfileId.toString() !== studentProfile._id.toString()) {
      throw createError('Access denied. You can only view your own resume.', 403);
    }
  } else if (user.role === 'recruiter') {
    const recruiter = await RecruiterProfile.findOne({ userId: user.id });
    if (!recruiter || !recruiter.companyId) {
      throw createError('Access denied. No authorized company associated with recruiter profile.', 403);
    }
    const companyDrives = await PlacementDrive.find({ companyId: recruiter.companyId }).select('_id');
    const driveIds = companyDrives.map((d) => d._id);
    const hasApplication = await Application.findOne({
      placementDriveId: { $in: driveIds },
      $or: [
        { resumeId: resume._id },
        { studentProfileId: resume.studentProfileId },
      ],
    });
    if (!hasApplication) {
      throw createError('Access denied. You are only authorized to preview resumes of candidates who have applied to your company drives.', 403);
    }
  }

  // Prevent path traversal
  const safeFilename = path.basename(resume.storageKey);
  const filePath = path.join(RESUME_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    throw createError('Stored resume file is unavailable on storage volume.', 404);
  }

  return {
    filePath,
    originalFilename: resume.originalFilename,
    mimeType: resume.mimeType || 'application/pdf',
    sizeBytes: resume.sizeBytes,
  };
}

/**
 * Delete a specific resume (only if not attached to an active application)
 */
async function deleteResume(studentUserId, resumeId) {
  const studentProfile = await StudentProfile.findOne({ userId: studentUserId });
  if (!studentProfile) {
    throw createError('Student profile not found', 404);
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    studentProfileId: studentProfile._id,
  });

  if (!resume) {
    throw createError('Resume document not found', 404);
  }

  // Verify not attached to an active submitted application
  const activeApp = await Application.findOne({
    resumeId: resume._id,
    status: { $in: ['submitted', 'under_review', 'shortlisted', 'selected'] },
  });

  if (activeApp) {
    throw createError(
      'Cannot delete a resume currently linked to an active placement application.',
      400
    );
  }

  // Remove file from disk
  const safeFilename = path.basename(resume.storageKey);
  const filePath = path.join(RESUME_DIR, safeFilename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {}
  }

  await Resume.findByIdAndDelete(resume._id);

  // If deleted resume was the active one, clear StudentProfile.resume
  if (resume.isActive) {
    await StudentProfile.findByIdAndUpdate(studentProfile._id, {
      $unset: { resume: 1 },
    });
  }

  return { message: 'Resume document removed successfully' };
}

module.exports = {
  uploadResume,
  getResumeStatus,
  getResumeFile,
  deleteResume,
};
