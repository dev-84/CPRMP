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
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 1900,
    },
    currentSemester: {
      type: Number,
      min: 1,
    },
    cgpa: {
      type: Number,
      min: 0,
    },
    backlogCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'studentprofiles',
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);