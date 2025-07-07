const express = require('express');
const { protect } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// NewsData.io API configuration
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;
const NEWSDATA_BASE_URL = 'https://newsdata.io/api/1/news';

// Category mapping for NewsData.io API
const CATEGORY_MAPPING = {
  general: 'top',
  business: 'business',
  technology: 'technology',
  sports: 'sports',
  entertainment: 'entertainment',
  health: 'health',
  science: 'science',
  politics: 'politics'
};

// Cache for API responses (simple in-memory cache)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for nextPage tokens per category
const nextPageTokens = new Map();



// Clean up expired cache entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

const fetchNewsFromAPI = async (category, pageToken = null, limit = 10) => {
  try {
    // Create cache key - use pageToken in cache key
    const cacheKey = `${category}_${pageToken || 'first'}_${limit}`;
    const cached = cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }

    // Prepare API parameters - Always use 10 for consistency
    const params = {
      apikey: NEWSDATA_API_KEY,
      q: category === 'general' ? 'india' : `india ${category}`,
      language: 'en',
      size: 10 // Always request 10 articles for consistency
    };

    // Only add category if it's a valid category and not 'general'
    if (category !== 'general' && CATEGORY_MAPPING[category]) {
      params.category = CATEGORY_MAPPING[category];
    }

    // Add page parameter for pagination - use nextPage token if available
    if (pageToken) {
      params.page = pageToken;
    }

    const response = await axios.get(NEWSDATA_BASE_URL, { params });
    
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'API request failed');
    }

    // Transform API response to match our format
    const articles = response.data.results.map(article => ({
      title: article.title || 'No Title',
      description: article.description || 'No description available',
      link: article.link || '#',
      image_url: article.image_url || null,
      pubDate: article.pubDate || new Date().toISOString(),
      source_id: article.source_id || 'Unknown Source',
      creator: article.creator || ['Unknown Author'],
      category: category,
      content: article.content || null,
      country: article.country || ['India'],
      language: article.language || 'en'
    }));

    // Store the nextPage token for this category
    if (response.data.nextPage) {
      nextPageTokens.set(category, response.data.nextPage);
    } else {
      nextPageTokens.delete(category);
    }

    const result = {
      articles: articles,
      totalArticles: response.data.totalResults || articles.length,
      hasMore: response.data.nextPage !== null,
      nextPageToken: response.data.nextPage,
      currentPage: pageToken ? 'next' : 'first',
      totalPages: Math.ceil((response.data.totalResults || articles.length) / limit)
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;

  } catch (error) {
    console.error('Error fetching news from API:', error.message);
    
    // Log detailed error information
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        params: error.config?.params
      });
    }
    
    throw error;
  }
};

// @route   GET /api/news
// @desc    Get news articles from NewsData.io API (requires authentication)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category = 'general', pageToken, limit = 10 } = req.query;
    
    // Validate category
    const validCategories = Object.keys(CATEGORY_MAPPING);
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Valid categories are: ' + validCategories.join(', ')
      });
    }

    // Validate pagination parameters - Always use 10 for consistency
    const limitNum = 10; // Always use 10 articles

    // Check if API key is configured
    if (!NEWSDATA_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'NewsData.io API key not configured. Please check your environment variables.'
      });
    }

    // Determine the page token to use
    let tokenToUse = pageToken;
    
    // If no pageToken provided, check if we have a stored token for this category
    if (!pageToken && nextPageTokens.has(category)) {
      tokenToUse = nextPageTokens.get(category);
    }

    // Fetch from NewsData.io API
    const result = await fetchNewsFromAPI(category, tokenToUse, limitNum);

    res.json({
      success: true,
      message: 'News fetched successfully from NewsData.io API',
      data: {
        articles: result.articles,
        totalResults: result.totalArticles,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        nextPageToken: result.nextPageToken,
        status: 'success',
        source: 'NewsData.io API',
        user: req.user.getProfile()
      }
    });

  } catch (error) {
    console.error('News fetch error:', error.message);

    // Handle specific API errors
    if (error.response && error.response.status === 422) {
      return res.status(422).json({
        success: false,
        message: 'Invalid API request parameters.',
        errorCode: 422
      });
    }

    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'API key is invalid or expired.',
        errorCode: 401
      });
    }

    if (error.response && error.response.status === 403) {
      return res.status(403).json({
        success: false,
        message: 'API access denied.',
        errorCode: 403
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching news',
      errorCode: 500
    });
  }
});

// @route   GET /api/news/categories
// @desc    Get available news categories
// @access  Private
router.get('/categories', protect, async (req, res) => {
  try {
    const categories = [
      { id: 'general', name: 'General News', icon: 'fas fa-newspaper' },
      { id: 'politics', name: 'Politics', icon: 'fas fa-landmark' },
      { id: 'business', name: 'Business & Finance', icon: 'fas fa-briefcase' },
      { id: 'technology', name: 'Technology', icon: 'fas fa-microchip' },
      { id: 'sports', name: 'Sports', icon: 'fas fa-futbol' },
      { id: 'entertainment', name: 'Entertainment', icon: 'fas fa-film' },
      { id: 'health', name: 'Health', icon: 'fas fa-heartbeat' },
      { id: 'science', name: 'Science', icon: 'fas fa-flask' }
    ];

    res.json({
      success: true,
      data: {
        categories,
        user: req.user.getProfile()
      }
    });

  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/news/search
// @desc    Search news articles using NewsData.io API
// @access  Private
router.get('/search', protect, async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }



    // Prepare search parameters - Always use 10 for consistency
    const params = {
      apikey: NEWSDATA_API_KEY,
      q: q,
      language: 'en',
      size: 10 // Always request 10 articles for consistency
    };

    // Add category filter if specified
    if (category && CATEGORY_MAPPING[category]) {
      params.category = CATEGORY_MAPPING[category];
    }

    const response = await axios.get(NEWSDATA_BASE_URL, { params });
    
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Search request failed');
    }

    // Transform search results
    const articles = response.data.results.map(article => ({
      title: article.title || 'No Title',
      description: article.description || 'No description available',
      link: article.link || '#',
      image_url: article.image_url || null,
      pubDate: article.pubDate || new Date().toISOString(),
      source_id: article.source_id || 'Unknown Source',
      creator: article.creator || ['Unknown Author'],
      category: category || 'general',
      content: article.content || null,
      country: article.country || ['India'],
      language: article.language || 'en'
    }));

    res.json({
      success: true,
      message: 'Search completed successfully',
      data: {
        articles: articles,
        totalResults: response.data.totalResults || articles.length,
        query: q,
        category: category || 'all',
        user: req.user.getProfile()
      }
    });

  } catch (error) {
    console.error('News search error:', error.message);

    if (error.response && error.response.status === 422) {
      return res.status(422).json({
        success: false,
        message: 'Invalid search parameters.',
        errorCode: 422
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while searching news',
      errorCode: 500
    });
  }
});



// @route   GET /api/news/test
// @desc    Test endpoint to debug NewsData.io API integration
// @access  Private
router.get('/test', protect, async (req, res) => {
  try {
    // Test basic API call
    const params = {
      apikey: NEWSDATA_API_KEY,
      q: 'india',
      language: 'en',
      size: 5
    };
    
    const response = await axios.get(NEWSDATA_BASE_URL, { params });
    
    res.json({
      success: true,
      message: 'API test completed successfully',
      data: {
        status: response.data.status,
        totalResults: response.data.totalResults,
        resultsCount: response.data.results?.length || 0,
        nextPage: response.data.nextPage,
        sampleArticle: response.data.results?.[0] || null,
        apiKeyConfigured: !!NEWSDATA_API_KEY,
        apiKeyLength: NEWSDATA_API_KEY ? NEWSDATA_API_KEY.length : 0
      }
    });
    
  } catch (error) {
    console.error('API Test Error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'API test failed',
      error: error.message,
      errorCode: error.response?.status || 500
    });
  }
});

module.exports = router; 