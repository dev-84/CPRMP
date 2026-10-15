const { body, validationResult } = require("express-validator");

const validateRegistration = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must contain 2 to 100 characters"),

  body("email")
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .bail()
    .custom((password) => Buffer.byteLength(password, "utf8") <= 72)
    .withMessage("Password must not exceed 72 UTF-8 bytes"),

  body("role")
    .optional()
    .isIn(["student", "recruiter"])
    .withMessage("Role must be student or recruiter"),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
}

module.exports = {
  validateRegistration,
  handleValidationErrors,
};
