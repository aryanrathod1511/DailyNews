const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required!');
  console.log('💡 Create a .env file in the backend directory with:');
  console.log('JWT_SECRET=your-super-secret-jwt-key-change-this-in-production');
  process.exit(1);
}

if (!process.env.DATABASE_URL && !process.env.MONGODB_URI) {
  console.error('❌ DATABASE_URL or MONGODB_URI environment variable is required!');
  console.log('💡 Create a .env file in the backend directory with:');
  console.log('DATABASE_URL=mongodb://localhost:27017/newsapp');
  process.exit(1);
}


const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'https://daily-news-delta.vercel.app',
  credentials: false,
}));
app.options('*', cors());


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoUrl = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/newsapp';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Samachar API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);
}); 
