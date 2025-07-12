const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/apiError');
const { ApiResponse } = require('../utils/apiResponse');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return ApiResponse.unauthorized(res, 'Access denied. No token provided.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return ApiResponse.unauthorized(res, 'Token is not valid. User not found.');
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return ApiResponse.unauthorized(res, 'Invalid token.');
    }
    
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token has expired. Please login again.');
    }

    return ApiResponse.internalServerError(res, 'Token verification failed.');
  }
};

module.exports = {
  protect
}; 