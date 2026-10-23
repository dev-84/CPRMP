
const { body, validationResult } = require('express-validator');

const allowedProfileFields = [
  'studentId',
  'rollNo',
  'phone',
  'department',
  'degree',
  'graduationYear',
  'currentSemester',
  'cgpa',
  'backlogCount',
  'historicalBacklogs',
  'skills',
  'fullName',
  'firstName',
  'middleName',
  'lastName',
  'collegeName',
  'prn',
  'personalEmail',
  'institutionalEmail',
  'alternatePhone',
  'address',
  'socialLinks',
  'qualifications',
  'categorizedSkills',
  'projects',
  'certifications',
  'resume',
  'accountVerificationStatus',
  'placementVerificationStatus',
];


function rejectUnknownProfileFields(req, res, next) {
  const input = req.body;

  if (
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input)
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Request body must be a JSON object',
    });
  }

  const unknownFields = Object.keys(input).filter(
    (field) => !allowedProfileFields.includes(field)
  );

  if (unknownFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Request contains unsupported profile fields',
      errors: unknownFields.map((field) => ({
        field,
        message: 'This field cannot be supplied',
      })),
    });
  }

  return next();
}

const validateProfileFields = [
  body('studentId')
    .optional()
    .isString()
    .withMessage('Student ID must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Student ID cannot be empty')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Student ID must not exceed 50 characters'),

  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .bail()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone must not exceed 20 characters'),

  body('department')
    .optional()
    .isString()
    .withMessage('Department must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Department cannot be empty')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Department must not exceed 100 characters'),

  body('degree')
    .optional()
    .isString()
    .withMessage('Degree must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Degree cannot be empty')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Degree must not exceed 100 characters'),

  body('graduationYear')
    .optional()
    .isInt({ min: 1900, max: 2200 })
    .withMessage('Graduation year must be between 1900 and 2200')
    .toInt(),

  body('currentSemester')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Current semester must be between 1 and 20')
    .toInt(),

  body('cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('CGPA must be between 0 and 10')
    .toFloat(),

  body('backlogCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Backlog count must be a non-negative integer')
    .toInt(),

  body('skills')
    .optional()
    .isArray({ max: 100 })
    .withMessage('Skills must be an array with at most 100 items'),

  body('skills.*')
    .optional()
    .isString()
    .withMessage('Each skill must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Skill names cannot be empty')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Each skill must not exceed 50 characters'),
];

const validateCreateProfile = [
  body('studentId')
    .exists({ values: 'undefined' })
    .withMessage('Student ID is required'),

  body('department')
    .exists({ values: 'undefined' })
    .withMessage('Department is required'),

  body('degree')
    .exists({ values: 'undefined' })
    .withMessage('Degree is required'),

  body('graduationYear')
    .exists({ values: 'undefined' })
    .withMessage('Graduation year is required'),

  ...validateProfileFields,
];

const validateUpdateProfile = [
  body().custom((value) => {
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      Object.keys(value).length === 0
    ) {
      throw new Error('Provide at least one profile field to update');
    }

    return true;
  }),

  ...validateProfileFields,
];

function handleProfileValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map((error) => ({
        field: error.path || 'body',
        message: error.msg,
      })),
    });
  }

  return next();
}

module.exports = {
  rejectUnknownProfileFields,
  validateCreateProfile,
  validateUpdateProfile,
  handleProfileValidationErrors,
};
