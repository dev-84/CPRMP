
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authorization = req.get('authorization');

  if (!authorization) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token is required',
    });
  }

  // Accept only the Bearer authentication scheme.
  const match = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid authentication token',
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }

  try {
    const payload = jwt.verify(match[1], secret, {
      issuer: 'cprmp-api',
      audience: 'cprmp-client',
      algorithms: ['HS256'],
    });

    if (
      typeof payload !== 'object' ||
      typeof payload.sub !== 'string' ||
      payload.sub.length === 0 ||
      !['student', 'recruiter', 'admin'].includes(payload.role)
    ) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid authentication token',
      });
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    return next();
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError' ||
      error.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired authentication token',
      });
    }

    return next(error);
  }
}

module.exports = authMiddleware;
