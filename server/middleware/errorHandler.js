const { StatusCodes } = require('http-status-codes');

const notFoundHandler = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const response = {
    message: err.message || 'Something went wrong',
    ...(err.code && { code: err.code }),
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  console.error('[API_ERROR]', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
  });

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};


