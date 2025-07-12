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

<<<<<<< HEAD
startServer(); 
=======
// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'https://daily-news-delta.vercel.app',
  credentials: false
}));
app.options('*', cors());

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

app.get("/api/ping", (req, res) => {
  res.send("Pong");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);


  setInterval(() => {
    fetch('https://samachar-bvem.onrender.com/api/ping')
      .then(res => console.log(`[PING] ${res.status} @ ${new Date().toISOString()}`))
      .catch(err => console.error('[PING ERROR]', err));
  }, 5 * 60 * 1000); // every 10 mins
});



>>>>>>> c4ac9972d56eb8be5a67dc92ae309e4dd9eb57f0
