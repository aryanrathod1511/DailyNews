const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up backend environment...\n');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/newsapp
MONGODB_URI=mongodb://localhost:27017/newsapp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-${Date.now()}
JWT_EXPIRE=7d

# GNews API Key (Get from https://gnews.io/)
NEWS_API_KEY=your-gnews-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
} else {
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with default configuration');
    console.log('📝 Please review and update the .env file as needed');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    console.log('\n📝 Please create a .env file manually with the following content:');
    console.log(envContent);
  }
}

console.log('\n🚀 You can now start the backend with: npm run dev');
console.log('💡 Make sure MongoDB is running on localhost:27017'); 