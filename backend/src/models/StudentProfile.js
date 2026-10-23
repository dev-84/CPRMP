
const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 1900,
      max: 2200,
      validate: {
        validator: Number.isInteger,
        message: 'Graduation year must be an integer',
      },
    },
    currentSemester: {
      type: Number,
      min: 1,
      max: 20,
      validate: {
        validator: Number.isInteger,
        message: 'Current semester must be an integer',
      },
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    backlogCount: {
      type: Number,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Backlog count must be a non-negative integer',
      },
      default: 0,
    },
    skills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      default: [],
      validate: {
        validator: (skills) => skills.length <= 100,
        message: 'Skills must contain at most 100 items',
      },
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    middleName: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    collegeName: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    prn: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    accountVerificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified'],
      default: 'verified',
    },
    placementVerificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'pending',
    },
    personalEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    alternatePhone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    address: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
      postalCode: { type: String, trim: true },
      currentAddress: { type: String, trim: true },
      permanentAddress: { type: String, trim: true },
      willingToRelocate: { type: Boolean, default: true },
      preferredLocations: [{ type: String, trim: true }],
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      portfolio: { type: String, trim: true },
      other: { type: String, trim: true },
    },
    qualifications: [
      {
        id: { type: String },
        level: {
          type: String,
          enum: ['10th', '12th', 'ug', 'pg', 'diploma', 'other'],
        },
        title: { type: String, trim: true },
        schoolOrCollege: { type: String, trim: true },
        boardOrUniversity: { type: String, trim: true },
        streamOrSpecialization: { type: String, trim: true },
        passingYear: { type: Number },
        scoreType: {
          type: String,
          enum: ['percentage', 'cgpa'],
          default: 'cgpa',
        },
        score: { type: Number },
        maxScore: { type: Number },
        gradingScale: { type: String, trim: true },
        status: {
          type: String,
          enum: ['completed', 'in_progress'],
          default: 'completed',
        },
        currentSemester: { type: Number },
        activeBacklogs: { type: Number, default: 0 },
        historicalBacklogs: { type: Number, default: 0 },
        marksheetUrl: { type: String },
        marksheetFilename: { type: String },
        marksheetOriginalName: { type: String },
        marksheetFileSize: { type: Number },
        marksheetMimeType: { type: String },
        marksheetUploadedAt: { type: Date },
        verificationStatus: {
          type: String,
          enum: ['not_provided', 'pending', 'verified', 'rejected'],
          default: 'pending',
        },
        verificationRemarks: { type: String, trim: true },
      },
    ],
    categorizedSkills: [
      {
        category: { type: String, trim: true },
        skills: [{ type: String, trim: true }],
      },
    ],
    projects: [
      {
        id: { type: String },
        title: { type: String, trim: true },
        category: { type: String, trim: true },
        description: { type: String, trim: true },
        technologies: [{ type: String, trim: true }],
        startDate: { type: String },
        endDate: { type: String },
        role: { type: String, trim: true },
        githubUrl: { type: String, trim: true },
        liveUrl: { type: String, trim: true },
        verificationStatus: {
          type: String,
          enum: ['unverified', 'verified'],
          default: 'unverified',
        },
      },
    ],
    certifications: [
      {
        id: { type: String },
        name: { type: String, trim: true },
        issuingOrganization: { type: String, trim: true },
        issueDate: { type: String },
        expirationDate: { type: String },
        credentialId: { type: String, trim: true },
        credentialUrl: { type: String, trim: true },
        verificationStatus: {
          type: String,
          enum: ['unverified', 'verified'],
          default: 'unverified',
        },
      },
    ],
    resume: {
      filename: { type: String },
      url: { type: String },
      fileSize: { type: Number },
      updatedAt: { type: Date },
    },
  },
  {
    timestamps: true,
    collection: 'studentprofiles',
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
