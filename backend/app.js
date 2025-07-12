const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { healthCheck } = require('./controllers/healthController');

const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');

const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  // app.use(cors({
  //   origin: process.env.FRONTEND_URL || 'https://daily-news-delta.vercel.app',
  //   credentials: false
  // }));
  app.use(cors());
  app.options('*', cors());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', healthCheck);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/news', newsRoutes);

  // Error handling middleware
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

module.exports = { createApp }; 