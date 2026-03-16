const { HttpError } = require('./httpError');

const notFoundHandler = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error('[request-error]', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
    details: err.details || null,
  });

  res.status(statusCode).json({
    error: {
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
};

module.exports = { notFoundHandler, errorHandler };
