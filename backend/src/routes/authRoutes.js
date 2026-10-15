
const express = require('express');

const {
  register,
  login,
} = require('../controllers/authController');

const {
  validateRegistration,
  handleValidationErrors,
} = require('../validators/authValidators');

const { body } = require('express-validator');

const router = express.Router();

const validateLogin = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .bail()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isString()
    .withMessage('Password must be a string')
    .bail()
    .notEmpty()
    .withMessage('Password is required'),
];

// POST /api/auth/register
router.post(
  '/register',
  validateRegistration,
  handleValidationErrors,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  login
);

module.exports = router;
