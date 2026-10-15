const mongoose = require('mongoose');

const eligibilityCriteriaSchema = new mongoose.Schema(
  {
    placementDriveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
      unique: true,
    },
    minimumCgpa: {
      type: Number,
      min: 0,
    },
    allowedDepartments: {
      type: [String],
      default: [],
    },
    allowedDegrees: {
      type: [String],
      default: [],
    },
    graduationYears: {
      type: [Number],
      default: [],
      validate: {
        validator: (years) =>
          years.every((year) => Number.isInteger(year) && year >= 1900),
        message: 'Graduation years must be integers of 1900 or later.',
      },
    },
    maximumBacklogs: {
      type: Number,
      min: 0,
      validate: {
        validator: (value) => Number.isInteger(value),
        message: 'Maximum backlogs must be a whole number.',
      },
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    additionalRules: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'eligibilitycriteria',
  }
);

module.exports = mongoose.model(
  'EligibilityCriteria',
  eligibilityCriteriaSchema
);