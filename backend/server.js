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
      
      // Ping interval for keeping the server alive
      setInterval(() => {
        fetch('https://samachar-bvem.onrender.com/api/ping')
          .then(res => console.log(`[PING] ${res.status} @ ${new Date().toISOString()}`))
          .catch(err => console.error('[PING ERROR]', err));
      }, 5 * 60 * 1000); // every 5 mins
    });

  } catch (error) {
    console.log('❌ Failed to start server:', error);
  }
};

startServer();

