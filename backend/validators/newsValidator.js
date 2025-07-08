const { config } = require('../config/newsConfig');

const validateNewsQuery = (query) => {
  const errors = [];
  const { category, pageToken, limit } = query;

  // Validate category
  if (category && !Object.keys(config.CATEGORY_MAPPING).includes(category)) {
    errors.push(`Invalid category. Valid categories are: ${Object.keys(config.CATEGORY_MAPPING).join(', ')}`);
  }

  // Validate pageToken
  if (pageToken && typeof pageToken !== 'string') {
    errors.push('Page token must be a string');
  }

  // Validate limit
  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > config.LIMITS.MAX_ARTICLES) {
      errors.push(`Limit must be a number between 1 and ${config.LIMITS.MAX_ARTICLES}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateSearchQuery = (query) => {
  const errors = [];
  const { q: searchQuery, category, limit } = query;

  // Validate search query
  if (!searchQuery || typeof searchQuery !== 'string') {
    errors.push('Search query is required and must be a string');
  } else if (searchQuery.trim().length < 2) {
    errors.push('Search query must be at least 2 characters long');
  } else if (searchQuery.length > config.LIMITS.MAX_SEARCH_LENGTH) {
    errors.push(`Search query cannot exceed ${config.LIMITS.MAX_SEARCH_LENGTH} characters`);
  }

  // Validate category
  if (category && !Object.keys(config.CATEGORY_MAPPING).includes(category)) {
    errors.push(`Invalid category. Valid categories are: ${Object.keys(config.CATEGORY_MAPPING).join(', ')}`);
  }

  // Validate limit
  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > config.LIMITS.MAX_ARTICLES) {
      errors.push(`Limit must be a number between 1 and ${config.LIMITS.MAX_ARTICLES}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const sanitizeSearchQuery = (query) => {
  if (!query) return '';
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, config.LIMITS.MAX_SEARCH_LENGTH);
};

module.exports = {
  validateNewsQuery,
  validateSearchQuery,
  sanitizeSearchQuery
}; 