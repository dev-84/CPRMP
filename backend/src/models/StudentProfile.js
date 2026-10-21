
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
  },
  {
    timestamps: true,
    collection: 'studentprofiles',
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
