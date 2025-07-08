import { useState, useCallback, useRef } from 'react';
import { apiService } from '../services/api';

export const useSearch = (category = 'general') => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  
  const searchTimeout = useRef(null);

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const data = await apiService.searchNews(query, category, 10);

      if (data.success) {
        setSearchResults(data.data.articles);
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [category]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    
    if (!query) return;

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Debounce search
    searchTimeout.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  }, [searchQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
  }, []);

  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    
    // Clear results if query is empty
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
    }
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    error,
    handleSearch,
    clearSearch,
    updateSearchQuery,
    performSearch
  };
}; 