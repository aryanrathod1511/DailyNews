const { NewsService } = require('../services/newsService');
const { validateNewsQuery, validateSearchQuery } = require('../validators/newsValidator');
const { ApiResponse } = require('../utils/apiResponse');
const { ApiError } = require('../utils/apiError');

class NewsController {
  constructor() {
    this.newsService = new NewsService();
  }

 
  getNews = async (req, res, next) => {
    try {
      const { category = 'general', pageToken, limit = 10 } = req.query;
      
      // Validate input
      const validation = validateNewsQuery({ category, pageToken, limit });
      if (!validation.isValid) {
        throw new ApiError(400, validation.errors.join(', '));
      }

      const result = await this.newsService.getNews(category, pageToken, limit);

      const responseData = {
        articles: result.articles,
        totalResults: result.totalArticles,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        nextPageToken: result.nextPageToken,
        status: 'success',
        source: result.source,
        user: req.user.getProfile()
      };

      return ApiResponse.success(res, 'News fetched successfully', responseData);

    } catch (error) {
      console.error('News fetch error:', error);
      
      // Handle specific API errors
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessages = {
          422: 'Invalid API request parameters.',
          401: 'API authentication failed.',
          403: 'API access denied.',
          429: 'API rate limit exceeded. Please try again later.'
        };

        const message = errorMessages[statusCode] || 'External API error';
        return ApiResponse.unprocessableEntity(res, message);
      }

      next(error);
    }
  };

 
  searchNews = async (req, res, next) => {
    try {
      const { q: query, category = 'general', limit = 10 } = req.query;
      
      // Validate search query
      const searchValidation = validateSearchQuery({ q: query, category, limit });
      if (!searchValidation.isValid) {
        throw new ApiError(400, searchValidation.errors.join(', '));
      }

      const result = await this.newsService.searchNews(query, category, limit);

      const responseData = {
        articles: result.articles,
        totalResults: result.totalArticles,
        query: query,
        category: category,
        status: 'success',
        source: result.source
      };

      return ApiResponse.success(res, 'Search completed successfully', responseData);

    } catch (error) {
      console.error('News search error:', error);
      
      // Handle specific API errors
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessages = {
          422: 'Invalid search parameters.',
          401: 'API authentication failed.',
          403: 'API access denied.',
          429: 'API rate limit exceeded. Please try again later.'
        };

        const message = errorMessages[statusCode] || 'External API error';
        return ApiResponse.unprocessableEntity(res, message);
      }

      next(error);
    }
  };
}

module.exports = { NewsController }; 