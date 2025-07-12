const healthCheck = (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Samachar API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
};

module.exports = { healthCheck }; 