export const NEWS_CATEGORIES = {
  GENERAL: 'general',
  BUSINESS: 'business',
  TECHNOLOGY: 'technology',
  SPORTS: 'sports',
  ENTERTAINMENT: 'entertainment',
  HEALTH: 'health',
  SCIENCE: 'science',
  POLITICS: 'politics'
};

export const CATEGORY_LABELS = {
  [NEWS_CATEGORIES.GENERAL]: 'General',
  [NEWS_CATEGORIES.BUSINESS]: 'Business',
  [NEWS_CATEGORIES.TECHNOLOGY]: 'Technology',
  [NEWS_CATEGORIES.SPORTS]: 'Sports',
  [NEWS_CATEGORIES.ENTERTAINMENT]: 'Entertainment',
  [NEWS_CATEGORIES.HEALTH]: 'Health',
  [NEWS_CATEGORIES.SCIENCE]: 'Science',
  [NEWS_CATEGORIES.POLITICS]: 'Politics'
};

export const CATEGORY_ICONS = {
  [NEWS_CATEGORIES.GENERAL]: 'fas fa-newspaper',
  [NEWS_CATEGORIES.BUSINESS]: 'fas fa-briefcase',
  [NEWS_CATEGORIES.TECHNOLOGY]: 'fas fa-microchip',
  [NEWS_CATEGORIES.SPORTS]: 'fas fa-futbol',
  [NEWS_CATEGORIES.ENTERTAINMENT]: 'fas fa-film',
  [NEWS_CATEGORIES.HEALTH]: 'fas fa-heartbeat',
  [NEWS_CATEGORIES.SCIENCE]: 'fas fa-flask',
  [NEWS_CATEGORIES.POLITICS]: 'fas fa-landmark'
};

export const CATEGORY_COLORS = {
  [NEWS_CATEGORIES.GENERAL]: '#007bff',
  [NEWS_CATEGORIES.BUSINESS]: '#28a745',
  [NEWS_CATEGORIES.TECHNOLOGY]: '#17a2b8',
  [NEWS_CATEGORIES.SPORTS]: '#ffc107',
  [NEWS_CATEGORIES.ENTERTAINMENT]: '#e83e8c',
  [NEWS_CATEGORIES.HEALTH]: '#dc3545',
  [NEWS_CATEGORIES.SCIENCE]: '#6f42c1',
  [NEWS_CATEGORIES.POLITICS]: '#fd7e14'
};

export const getCategoryConfig = (category) => ({
  label: CATEGORY_LABELS[category] || 'Unknown',
  icon: CATEGORY_ICONS[category] || 'fas fa-newspaper',
  color: CATEGORY_COLORS[category] || '#6c757d'
}); 