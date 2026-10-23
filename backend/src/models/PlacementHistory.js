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
    tier: {
      type: String,
      trim: true,
      enum: ['Regular', 'Dream', 'Super Dream'],
      default: 'Regular',
    },
    offerLetterStatus: {
      type: String,
      trim: true,
      enum: ['issued', 'accepted', 'signed', 'rejected'],
      default: 'issued',
    },
    signedAt: {
      type: Date,
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