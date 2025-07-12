const mongoose = require('mongoose');
require('dotenv').config();

const { createApp } = require('./app');

const startServer = async () => {
  try {
    const app = createApp();
    const PORT = process.env.PORT || 5000;

    const mongoUrl = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/newsapp';
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');


    app.listen(PORT, () => {
      console.log(`🚀 Backend Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log('❌ Failed to start server:', error);
  }
};

startServer(); 
