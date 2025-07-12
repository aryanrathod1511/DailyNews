const { ApiResponse } = require('../utils/apiResponse');

// 404 Not Found Handler
const notFoundHandler = (req, res) => {
  return ApiResponse.notFound(res, 'Route not found');
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Handle custom ApiError
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return ApiResponse.badRequest(res, 'Validation Error', Object.values(err.errors).map(e => e.message));
  }

  if (err.name === 'CastError') {
    return ApiResponse.badRequest(res, 'Invalid ID format');
  }

  if (err.code === 11000) {
    return ApiResponse.conflict(res, 'Duplicate field value entered');
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token expired');
  }

  // Default error response
  return ApiResponse.internalServerError(res, 'Internal server error', err.message);
};

module.exports = {
  notFoundHandler,
  errorHandler
}; 