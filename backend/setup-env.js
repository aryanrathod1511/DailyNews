const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Check if .env file already exists
if (fs.existsSync(envPath)) {
  console.log('.env file already exists. Please check if NEWS_API_KEY is set correctly.');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('NEWS_API_KEY=')) {
    console.log('NEWS_API_KEY is configured in .env file');
  } else {
    console.log('NEWS_API_KEY is missing from .env file');
  }
} else {
  // Create .env file with template
  const envTemplate = `# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/newsapp

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# GNews API Key
# Get your API key from: https://gnews.io/
NEWS_API_KEY=your_gnews_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('.env file created successfully!');
  console.log('Please edit the .env file and add your NewsData.io API key.');
  console.log('You can get a free API key from: https://newsdata.io/');
}

console.log('\nTo get a GNews API key:');
console.log('1. Go to https://gnews.io/');
console.log('2. Sign up for a free account');
console.log('3. Get your API key from the dashboard');
console.log('4. Replace "your_gnews_api_key_here" in the .env file with your actual API key');
console.log('5. Restart your backend server'); 