class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data && { data })
    });
  }

  static created(res, message = 'Created successfully', data = null) {
    return this.success(res, message, data, 201);
  }

  static badRequest(res, message = 'Bad request', errors = null) {
    return res.status(400).json({
      success: false,
      message,
      ...(errors && { errors })
    });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message
    });
  }

  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message
    });
  }

  static notFound(res, message = 'Not found') {
    return res.status(404).json({
      success: false,
      message
    });
  }

  static conflict(res, message = 'Conflict') {
    return res.status(409).json({
      success: false,
      message
    });
  }

  static unprocessableEntity(res, message = 'Unprocessable entity', errors = null) {
    return res.status(422).json({
      success: false,
      message,
      ...(errors && { errors })
    });
  }

  static tooManyRequests(res, message = 'Too many requests') {
    return res.status(429).json({
      success: false,
      message
    });
  }

  static internalServerError(res, message = 'Internal server error', error = null) {
    return res.status(500).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && error && { error })
    });
  }
}

module.exports = { ApiResponse }; 