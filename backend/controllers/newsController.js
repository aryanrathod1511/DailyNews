const { newsService } = require('../services/newsService');
const { validateNewsQuery } = require('../validators/newsValidator');

// @desc    Get news articles
// @route   GET /api/news
// @access  Private
const getNews = async (req, res) => {
  try {
    const { category = 'general', pageToken, limit = 10 } = req.query;
    
    // Validate input
    const validation = validateNewsQuery({ category, pageToken, limit });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(', ')
      });
    }

    const result = await newsService.getNews(category, pageToken, limit);

    res.json({
      success: true,
      message: 'News fetched successfully',
      data: {
        articles: result.articles,
        totalResults: result.totalArticles,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        nextPageToken: result.nextPageToken,
        status: 'success',
        source: result.source,
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
        message: 'API authentication failed.',
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
      message: 'Internal server error while fetching news.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// @desc    Search news articles
// @route   GET /api/news/search
// @access  Private
const searchNews = async (req, res) => {
  try {
    const { q: query, category = 'general', limit = 10 } = req.query;
    
    // Validate search query
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long.'
      });
    }

    const validation = validateNewsQuery({ category, limit });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(', ')
      });
    }

    const result = await newsService.searchNews(query, category, limit);

    res.json({
      success: true,
      message: 'Search completed successfully',
      data: {
        articles: result.articles,
        totalResults: result.totalArticles,
        query: query,
        category: category,
        status: 'success',
        source: result.source
      }
    });

  } catch (error) {
    console.error('News search error:', error.message);
    
    // Handle specific API errors
    if (error.response && error.response.status === 422) {
      return res.status(422).json({
        success: false,
        message: 'Invalid search parameters.',
        errorCode: 422
      });
    }

    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'API authentication failed.',
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
      message: 'Internal server error while searching news.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

module.exports = {
  getNews,
  searchNews
}; 