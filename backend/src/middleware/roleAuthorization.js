
function authorizeRoles(...allowedRoles) {
  const validRoles = ['student', 'recruiter', 'admin'];

  if (
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => !validRoles.includes(role))
  ) {
    throw new Error('authorizeRoles requires valid role names');
  }

  return function roleAuthorizationMiddleware(req, res, next) {
    // Authentication middleware must run before this middleware.
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication is required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this resource',
      });
    }

    return next();
  };
}

module.exports = { authorizeRoles };
