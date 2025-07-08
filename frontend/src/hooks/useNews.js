import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api';

export const useNews = (category = 'general') => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [newsSource, setNewsSource] = useState('');
  
  // Refs to prevent multiple requests
  const isLoadingMore = useRef(false);
  const currentPageToken = useRef(null);

  const fetchNews = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
    } else {
      isLoadingMore.current = true;
    }
    setError(null);
    
    try {
      const pageToken = isLoadMore ? currentPageToken.current : null;
      const data = await apiService.getNews(category, pageToken, 10);

      if (data.success) {
        const newArticles = data.data.articles;
        
        if (isLoadMore) {
          // Combine existing articles with new ones
          setArticles(prevArticles => [...prevArticles, ...newArticles]);
        } else {
          // Set new articles
          setArticles(newArticles);
        }
        
        setNewsSource(data.data.source || '');
        setHasMore(data.data.hasMore);
        
        const newToken = data.data.nextPageToken || null;
        setNextPageToken(newToken);
        currentPageToken.current = newToken;
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      isLoadingMore.current = false;
    }
  }, [category]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore.current && hasMore && nextPageToken) {
      fetchNews(true);
    }
  }, [fetchNews, hasMore, nextPageToken]);

  const resetNews = useCallback(() => {
    setArticles([]);
    setNextPageToken(null);
    currentPageToken.current = null;
    setHasMore(true);
    setError(null);
    isLoadingMore.current = false;
  }, []);

  // Reset and load news when category changes
  useEffect(() => {
    resetNews();
    fetchNews();
  }, [category, fetchNews, resetNews]);

  return {
    articles,
    loading,
    error,
    hasMore,
    newsSource,
    loadMore,
    resetNews,
    refetch: () => fetchNews()
  };
}; 