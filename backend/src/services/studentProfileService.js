
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const StudentProfile = require('../models/StudentProfile');
const { MARKSHEET_DIR } = require('../middleware/marksheetUpload');

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
  'fullName',
  'firstName',
  'middleName',
  'lastName',
  'collegeName',
  'prn',
  'accountVerificationStatus',
  'placementVerificationStatus',
  'personalEmail',
  'alternatePhone',
  'address',
  'socialLinks',
  'qualifications',
  'categorizedSkills',
  'projects',
  'certifications',
  'resume',
];

function getDefaultQualifications(degree = 'MCA', cgpa = 8.84, gradYear = 2027) {
  return [
    {
      id: 'qual-10th',
      level: '10th',
      title: 'Secondary School Certificate (Class X)',
      schoolOrCollege: "St. Xavier's High School",
      boardOrUniversity: 'CBSE Board',
      streamOrSpecialization: 'General Science & Mathematics',
      passingYear: 2020,
      scoreType: 'percentage',
      score: 94.2,
      maxScore: 100,
      status: 'completed',
      activeBacklogs: 0,
      historicalBacklogs: 0,
      verificationStatus: 'verified',
      verificationRemarks: 'Verified against CBSE Roll',
    },
    {
      id: 'qual-12th',
      level: '12th',
      title: 'Higher Secondary Certificate (Class XII)',
      schoolOrCollege: 'Delhi Public College',
      boardOrUniversity: 'State Board of Intermediate',
      streamOrSpecialization: 'Science (Physics, Chemistry, Mathematics)',
      passingYear: 2022,
      scoreType: 'percentage',
      score: 91.8,
      maxScore: 100,
      status: 'completed',
      activeBacklogs: 0,
      historicalBacklogs: 0,
      verificationStatus: 'verified',
      verificationRemarks: 'Verified against State Board Roll',
    },
    {
      id: 'qual-ug',
      level: 'ug',
      title: 'Bachelor of Computer Applications (BCA)',
      schoolOrCollege: 'Department of Computer Science',
      boardOrUniversity: 'State University of Technology',
      streamOrSpecialization: 'Computer Applications & Software Systems',
      passingYear: 2025,
      scoreType: 'cgpa',
      score: 8.72,
      maxScore: 10.0,
      status: 'completed',
      activeBacklogs: 0,
      historicalBacklogs: 0,
      verificationStatus: 'verified',
      verificationRemarks: 'Consolidated transcript verified',
    },
    {
      id: 'qual-pg',
      level: 'pg',
      title: `Master of Computer Applications (${degree || 'MCA'})`,
      schoolOrCollege: 'University College of Engineering',
      boardOrUniversity: 'Central University',
      streamOrSpecialization: 'Software Engineering & Cloud Computing',
      passingYear: gradYear || 2027,
      scoreType: 'cgpa',
      score: cgpa || 8.84,
      maxScore: 10.0,
      status: 'in_progress',
      currentSemester: 3,
      activeBacklogs: 0,
      historicalBacklogs: 0,
      verificationStatus: 'pending',
      verificationRemarks: 'Semester 3 marksheet pending university examination cycle',
    },
  ];
}

function mergeQualificationsWithDefaults(existingList = [], degree, cgpa, gradYear) {
  const defaults = getDefaultQualifications(degree, cgpa, gradYear);
  const result = [];

  for (const def of defaults) {
    const found = (existingList || []).find(
      (q) => q.level === def.level || q.id === def.id || (q.id && q.id.includes(def.level))
    );
    if (found) {
      const raw = typeof found.toObject === 'function' ? found.toObject() : found;
      result.push({
        ...def,
        ...raw,
        title: raw.title && !raw.title.startsWith('QUAL-') ? raw.title : def.title,
        schoolOrCollege: raw.schoolOrCollege || def.schoolOrCollege,
        boardOrUniversity: raw.boardOrUniversity || def.boardOrUniversity,
        streamOrSpecialization: raw.streamOrSpecialization || def.streamOrSpecialization,
        score: raw.score !== undefined && raw.score !== null && !isNaN(Number(raw.score)) ? Number(raw.score) : def.score,
        scoreType: raw.scoreType || def.scoreType,
        passingYear: raw.passingYear || def.passingYear,
        status: raw.status || def.status,
      });
    } else {
      result.push(def);
    }
  }

  for (const q of (existingList || [])) {
    const raw = typeof q.toObject === 'function' ? q.toObject() : q;
    const isStandardLevel = ['10th', '12th', 'ug', 'pg'].includes(raw.level);
    const isStandardId = ['qual-10th', 'qual-12th', 'qual-ug', 'qual-pg'].includes(raw.id);
    if (!isStandardLevel && !isStandardId && !result.some((r) => r.id === raw.id)) {
      result.push(raw);
    }
  }

  return result;
}

function toPublicProfile(profile) {
  if (!profile) return null;

  return {
    id: profile._id.toString(),
    userId: profile.userId?.toString ? profile.userId.toString() : profile.userId,
    studentId: profile.studentId,
    fullName: profile.fullName || '',
    firstName: profile.firstName || '',
    middleName: profile.middleName || '',
    lastName: profile.lastName || '',
    collegeName: profile.collegeName || '',
    prn: profile.prn || '',
    accountVerificationStatus: profile.accountVerificationStatus || 'verified',
    placementVerificationStatus: profile.placementVerificationStatus || 'pending',
    phone: profile.phone,
    personalEmail: profile.personalEmail || '',
    alternatePhone: profile.alternatePhone || '',
    department: profile.department,
    degree: profile.degree,
    graduationYear: profile.graduationYear,
    currentSemester: profile.currentSemester,
    cgpa: profile.cgpa,
    backlogCount: profile.backlogCount,
    skills: profile.skills || [],
    address: profile.address || {
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      currentAddress: '',
      permanentAddress: '',
      willingToRelocate: true,
      preferredLocations: [],
    },
    socialLinks: profile.socialLinks || {
      linkedin: '',
      github: '',
      portfolio: '',
      other: '',
    },
    qualifications: mergeQualificationsWithDefaults(
      profile.qualifications,
      profile.degree,
      profile.cgpa,
      profile.graduationYear
    ),
    categorizedSkills: profile.categorizedSkills || [],
    projects: profile.projects || [],
    certifications: profile.certifications || [],
    resume: profile.resume || null,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

function pickProfileFields(input) {
  const fields = {};

  if (input.rollNo && !input.studentId) {
    fields.studentId = input.rollNo;
  }

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

async function uploadMarksheet(userId, qualId, file) {
  validateUserId(userId);
  if (!file) {
    throw createError('No marksheet file provided', 400);
  }

  const profile = await StudentProfile.findOne({ userId });
  if (!profile) {
    throw createError('Student profile not found', 404);
  }

  let qual = profile.qualifications.find((q) => q.id === qualId || q.level === qualId);
  const defaults = getDefaultQualifications(profile.degree, profile.cgpa, profile.graduationYear);
  const def = defaults.find((d) => d.id === qualId || d.level === qualId) || {};

  if (!qual) {
    const level = def.level || (qualId.includes('10')
      ? '10th'
      : qualId.includes('12')
      ? '12th'
      : qualId.includes('ug')
      ? 'ug'
      : qualId.includes('pg')
      ? 'pg'
      : 'other');

    qual = {
      ...def,
      id: qualId,
      level,
      title: def.title || qualId.toUpperCase(),
      marksheetUrl: `/api/student/profile/marksheet/${qualId}`,
      marksheetFilename: file.filename,
      marksheetOriginalName: file.originalname,
      marksheetFileSize: file.size,
      marksheetMimeType: file.mimetype,
      marksheetUploadedAt: new Date(),
      verificationStatus: 'pending',
    };
    profile.qualifications.push(qual);
  } else {
    if (!qual.title || qual.title.startsWith('QUAL-')) qual.title = def.title || qual.title;
    if (!qual.schoolOrCollege) qual.schoolOrCollege = def.schoolOrCollege || '';
    if (!qual.boardOrUniversity) qual.boardOrUniversity = def.boardOrUniversity || '';
    if (qual.score === undefined || isNaN(qual.score)) qual.score = def.score;
    if (!qual.scoreType) qual.scoreType = def.scoreType || 'cgpa';
    if (!qual.passingYear) qual.passingYear = def.passingYear;

    qual.marksheetUrl = `/api/student/profile/marksheet/${qualId}`;
    qual.marksheetFilename = file.filename;
    qual.marksheetOriginalName = file.originalname;
    qual.marksheetFileSize = file.size;
    qual.marksheetMimeType = file.mimetype;
    qual.marksheetUploadedAt = new Date();
    qual.verificationStatus = 'pending';
  }

  await profile.save();
  return toPublicProfile(profile);
}

async function getMarksheetFile(userId, qualId) {
  validateUserId(userId);

  const profile = await StudentProfile.findOne({ userId });
  if (!profile) {
    throw createError('Student profile not found', 404);
  }

  const qual = profile.qualifications.find((q) => q.id === qualId || q.level === qualId);
  if (!qual || !qual.marksheetFilename) {
    throw createError('Marksheet not found for this qualification', 404);
  }

  const filePath = path.join(MARKSHEET_DIR, qual.marksheetFilename);
  if (!fs.existsSync(filePath)) {
    throw createError('Marksheet file not found on disk', 404);
  }

  return {
    filePath,
    mimeType: qual.marksheetMimeType || 'application/pdf',
    originalName: qual.marksheetOriginalName || 'marksheet.pdf',
  };
}

module.exports = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  uploadMarksheet,
  getMarksheetFile,
};
