# NewsApp Backend API

A refactored, industry-standard Node.js/Express backend API for the NewsApp application with improved structure, modularity, and separation of concerns.

## 🏗️ Architecture Overview

The backend follows a clean, modular architecture with clear separation of concerns:

```
backend/
├── app.js                 # Express app configuration
├── server.js              # Server startup and database connection
├── config/                # Configuration files
│   └── newsConfig.js      # News API configuration
├── controllers/           # Request handlers
│   ├── authController.js  # Authentication logic
│   ├── newsController.js  # News API logic
│   └── healthController.js # Health check endpoint
├── middleware/            # Express middleware
│   ├── authMiddleware.js  # JWT authentication
│   ├── errorMiddleware.js # Global error handling
│   └── validationMiddleware.js # Request validation
├── models/                # Database models
│   └── User.js           # User model
├── routes/                # API routes
│   ├── authRoutes.js      # Authentication routes
│   └── newsRoutes.js      # News routes
├── services/              # Business logic
│   ├── authService.js     # Authentication business logic
│   ├── newsService.js     # News API business logic
│   └── cacheService.js    # Caching service
├── utils/                 # Utility functions
│   ├── apiResponse.js     # Standardized API responses
│   ├── apiError.js        # Custom error class
│   ├── logger.js          # Winston logger configuration
│   └── environmentValidator.js # Environment validation
├── validators/            # Input validation
│   └── newsValidator.js   # News query validation
└── logs/                  # Application logs
```

## 🚀 Features

- **Clean Architecture**: Separation of concerns with controllers, services, and models
- **Centralized Error Handling**: Consistent error responses across the application
- **Request Validation**: Input validation using express-validator
- **Authentication**: JWT-based authentication with middleware
- **Logging**: Console logging with structured error messages
- **Caching**: In-memory caching for API responses
- **Rate Limiting**: API rate limiting for security
- **Security**: Helmet.js for security headers
- **Environment Validation**: Startup validation of required environment variables

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- NewsData.io API key

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEWSDATA_API_KEY=your-newsdata-api-key
DATABASE_URL=mongodb://localhost:27017/newsapp
NODE_ENV=development
FRONTEND_URL=https://daily-news-delta.vercel.app
```

3. Start the development server:
```bash
npm run dev
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### News
- `GET /api/news` - Get news articles by category
- `GET /api/news/search` - Search news articles

### Health
- `GET /api/health` - Health check endpoint

## 🏛️ Architecture Patterns

### 1. Controller-Service Pattern
- **Controllers**: Handle HTTP requests/responses and validation
- **Services**: Contain business logic and external API calls
- **Models**: Define data structure and database operations

### 2. Middleware Pattern
- **Authentication Middleware**: JWT token verification
- **Validation Middleware**: Request validation using express-validator
- **Error Middleware**: Global error handling and logging

### 3. Utility Classes
- **ApiResponse**: Standardized API response formatting
- **ApiError**: Custom error class for consistent error handling
- **Console Logging**: Simple console-based logging

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Security headers with Helmet.js
- CORS configuration
- Input validation and sanitization

## 📊 Logging

The application uses console logging for simplicity:
- Console.error for errors
- Console.log for general information
- Structured error messages
- Request/response logging

## 🗄️ Caching

In-memory caching for:
- News API responses (5 minutes)
- Search results (2 minutes)
- Automatic cleanup of expired entries

## 🧪 Error Handling

- Custom ApiError class for operational errors
- Global error middleware for consistent error responses
- Specific error handling for different error types
- Development vs production error details

## 🔄 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| JWT_SECRET | JWT signing secret | Yes |
| NEWSDATA_API_KEY | NewsData.io API key | Yes |
| DATABASE_URL | MongoDB connection string | No (defaults to localhost) |
| NODE_ENV | Environment (development/production) | No |
| FRONTEND_URL | Frontend URL for CORS | No |

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run setup` - Run setup script

## 🏭 Production Deployment

1. Set environment variables
2. Install dependencies: `npm install --production`
3. Start server: `npm start`

## 🔍 Monitoring

- Health check endpoint for monitoring
- Structured logging for debugging
- Error tracking and reporting
- API response metrics

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use the provided utility classes for consistency
3. Add proper error handling and logging
4. Update documentation for new features
5. Follow the existing code style and conventions 