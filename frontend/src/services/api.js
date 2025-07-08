import { getAuthToken } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}, includeAuth = true) {
    const token = getAuthToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(includeAuth && token && { 'Authorization': `Bearer ${token}` })
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // News API methods
  async getNews(category = 'general', pageToken = null, limit = 10) {
    const params = new URLSearchParams({
      category,
      limit: limit.toString()
    });
    
    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    return this.request(`/api/news?${params.toString()}`);
  }

  async searchNews(query, category = 'general', limit = 10) {
    const params = new URLSearchParams({
      q: query,
      category,
      limit: limit.toString()
    });

    return this.request(`/api/news/search?${params.toString()}`);
  }

  // Auth API methods
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }, false); // Don't include auth header for login
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }, false); // Don't include auth header for register
  }

  async getProfile() {
    return this.request('/api/auth/me');
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST'
    });
  }
}

export const apiService = new ApiService();
export default apiService; 