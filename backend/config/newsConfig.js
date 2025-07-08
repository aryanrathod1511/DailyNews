const config = {
  NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY,
  NEWSDATA_BASE_URL: 'https://newsdata.io/api/1/news',
  
  // Category mapping for NewsData.io API
  CATEGORY_MAPPING: {
    general: 'top',
    business: 'business',
    technology: 'technology',
    sports: 'sports',
    entertainment: 'entertainment',
    health: 'health',
    science: 'science',
    politics: 'politics'
  },

  // Cache configuration
  CACHE: {
    DEFAULT_DURATION: 5 * 60 * 1000, // 5 minutes
    SEARCH_DURATION: 2 * 60 * 1000,  // 2 minutes
    CLEANUP_INTERVAL: 60 * 1000      // 1 minute
  },

  // API limits
  LIMITS: {
    DEFAULT_ARTICLES: 10,
    MAX_ARTICLES: 50,
    MAX_SEARCH_LENGTH: 100
  },

  // Error messages
  ERRORS: {
    API_KEY_MISSING: 'NewsData.io API key not configured. Please check your environment variables.',
    INVALID_CATEGORY: 'Invalid category provided.',
    INVALID_SEARCH: 'Search query must be at least 2 characters long.',
    API_FAILED: 'Failed to fetch news from external API.',
    RATE_LIMITED: 'API rate limit exceeded. Please try again later.'
  }
};

module.exports = { config }; 