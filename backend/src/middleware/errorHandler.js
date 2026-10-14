
function notFoundHandler(req, res, next) {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    message:
      statusCode >= 500
        ? 'Internal server error'
        : err.message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
