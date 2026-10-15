const mongoose = require('mongoose');

const placementHistorySchema = new mongoose.Schema(
  {
    studentProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    placementDriveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    packageAmount: {
      type: Number,
      min: 0,
    },
    packageCurrency: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    placedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'placementhistories',
  }
);

module.exports = mongoose.model('PlacementHistory', placementHistorySchema);