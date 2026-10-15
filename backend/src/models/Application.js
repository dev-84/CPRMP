const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    placementDriveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    appliedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: [
        'submitted',
        'under_review',
        'shortlisted',
        'rejected',
        'selected',
        'withdrawn',
      ],
      default: 'submitted',
    },
    eligibilityStatus: {
      type: String,
      required: true,
      enum: ['pending', 'eligible', 'ineligible'],
      default: 'pending',
    },
    eligibilityCheckedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'applications',
  }
);

applicationSchema.index(
  { studentProfileId: 1, placementDriveId: 1 },
  { unique: true }
);
applicationSchema.index({ placementDriveId: 1 });

module.exports = mongoose.model('Application', applicationSchema);