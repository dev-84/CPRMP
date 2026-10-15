const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    salary: {
      type: mongoose.Schema.Types.Mixed,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    driveDate: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'published', 'closed', 'cancelled'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
    collection: 'placementdrives',
  }
);

placementDriveSchema.index({ companyId: 1 });
module.exports = mongoose.model('PlacementDrive', placementDriveSchema);