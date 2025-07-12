const axios = require('axios');
const { config } = require('../config/newsConfig');
const { cacheService } = require('./cacheService');
const { ApiError } = require('../utils/apiError');

class NewsService {
  constructor() {
    this.apiKey = config.NEWSDATA_API_KEY;
    this.baseUrl = config.NEWSDATA_BASE_URL;
    this.categoryMapping = config.CATEGORY_MAPPING;
  }

  async getNews(category, pageToken = null, limit = 10) {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        throw new ApiError(500, config.ERRORS.API_KEY_MISSING);
      }

      // Check cache first
      const cacheKey = `${category}_${pageToken || 'first'}_${limit}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Prepare API parameters
      const params = {
        apikey: this.apiKey,
        q: category === 'general' ? 'india' : `india ${category}`,
        language: 'en',
        size: 10 // Always request 10 articles for consistency
      };

      // Add category if valid and not 'general'
      if (category !== 'general' && this.categoryMapping[category]) {
        params.category = this.categoryMapping[category];
      }

      // Add page parameter for pagination
      if (pageToken) {
        params.page = pageToken;
      }

      const response = await axios.get(this.baseUrl, { params });
      
      if (response.data.status !== 'success') {
        throw new ApiError(500, response.data.message || 'API request failed');
      }

      // Transform API response
      const articles = this.transformArticles(response.data.results, category);

      const result = {
        articles: articles,
        totalArticles: response.data.totalResults || articles.length,
        hasMore: response.data.nextPage !== null,
        nextPageToken: response.data.nextPage,
        currentPage: pageToken ? 'next' : 'first',
        totalPages: Math.ceil((response.data.totalResults || articles.length) / limit),
        source: 'NewsData.io API'
      };

      // Cache the result
      await cacheService.set(cacheKey, result);

      return result;

    } catch (error) {
      console.error('Error fetching news from API:', error);
      
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
  }

  async searchNews(query, category = 'general', limit = 10) {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        throw new ApiError(500, config.ERRORS.API_KEY_MISSING);
      }

      // Check cache first
      const cacheKey = `search_${query}_${category}_${limit}`;
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Prepare API parameters for search
      const params = {
        apikey: this.apiKey,
        q: query,
        language: 'en',
        size: limit
      };

      // Add category if valid and not 'general'
      if (category !== 'general' && this.categoryMapping[category]) {
        params.category = this.categoryMapping[category];
      }

      const response = await axios.get(this.baseUrl, { params });
      
      if (response.data.status !== 'success') {
        throw new ApiError(500, response.data.message || 'Search API request failed');
      }

      // Transform API response
      const articles = this.transformArticles(response.data.results, category);

      const result = {
        articles: articles,
        totalArticles: response.data.totalResults || articles.length,
        hasMore: response.data.nextPage !== null,
        nextPageToken: response.data.nextPage,
        currentPage: 'search',
        totalPages: Math.ceil((response.data.totalResults || articles.length) / limit),
        source: 'NewsData.io API'
      };

      // Cache the result with shorter duration for search
      await cacheService.set(cacheKey, result, config.CACHE.SEARCH_DURATION);

      return result;

    } catch (error) {
      console.error('Error searching news from API:', error);
      throw error;
    }
  }

  transformArticles(apiArticles, category) {
    return apiArticles.map(article => ({
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
      language: article.language || 'en',
      priority: this.calculatePriority(article)
    }));
  }

  calculatePriority(article) {
    // Simple priority calculation based on content quality
    let priority = 1;
    
    if (article.image_url) priority+=5;
    if (article.title && article.title.length > 10) priority++;
    if (article.description && article.description.length > 50) priority++;
    if (article.creator && article.creator.length > 0 && article.creator[0] !== 'Unknown Author') priority++;
    
    return priority;
  }
}

module.exports = { NewsService }; 