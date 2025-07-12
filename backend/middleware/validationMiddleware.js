const { validationResult } = require('express-validator');
const { ApiResponse } = require('../utils/apiResponse');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return ApiResponse.badRequest(res, 'Validation failed', errors.array());
  }
  
  next();
};

module.exports = { validateRequest }; 