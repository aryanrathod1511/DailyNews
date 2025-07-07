import React, { useState, useEffect, useCallback, useRef } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import { useAuth } from '../context/AuthContext';
import './News.css';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newsSource, setNewsSource] = useState('');
  // eslint-disable-next-line no-unused-vars
  const { user, token } = useAuth();
  
  // Refs to prevent multiple scroll requests
  const isLoadingMore = useRef(false);
  const scrollTimeout = useRef(null);
  const currentPageToken = useRef(null); // Track current page token to avoid dependency issues

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
    } else {
      isLoadingMore.current = true;
    }
    setError(null);
    
    try {
      // Always load 10 articles for consistency and to avoid API errors
      const limit = 10;
      
      // Build the URL with nextPage token if available
      let url = `/api/news?category=${props.category}&limit=${limit}`;
      if (isLoadMore && currentPageToken.current) {
        url += `&pageToken=${encodeURIComponent(currentPageToken.current)}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 422) {
          throw new Error('Invalid request. Please refresh the page.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Please check your permissions.');
        } else {
          throw new Error(data.message || 'Failed to fetch news');
        }
      }

      if (data.success) {
        if (isLoadMore) {
          setArticles(prevArticles => [...prevArticles, ...data.data.articles]);
        } else {
          setArticles(data.data.articles);
        }
        setNewsSource(data.data.source || '');
        setHasMore(data.data.hasMore);
        
        // Update both state and ref
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
  }, [props.category, token]); // Removed nextPageToken from dependencies

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`/api/news/search?q=${encodeURIComponent(searchQuery)}&category=${props.category}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (response.status === 422) {
          throw new Error('Invalid search query. Please try a different search term.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Please check your permissions.');
        } else {
          throw new Error(data.message || 'Search failed');
        }
      }

      if (data.success) {
        setSearchResults(data.data.articles);
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  // Reset and load news when category changes
  useEffect(() => {
    setNextPageToken(null);
    currentPageToken.current = null; // Reset ref as well
    setArticles([]);
    setHasMore(true);
    isLoadingMore.current = false; // Reset loading flag
    
    // Load initial news for the new category - use inline function to avoid dependency issues
    const loadInitialNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const limit = 10;
        const url = `/api/news?category=${props.category}&limit=${limit}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 422) {
            throw new Error('Invalid request. Please refresh the page.');
          } else if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
          } else if (response.status === 403) {
            throw new Error('Access denied. Please check your permissions.');
          } else {
            throw new Error(data.message || 'Failed to fetch news');
          }
        }

        if (data.success) {
          setArticles(data.data.articles);
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
      }
    };
    
    loadInitialNews();
  }, [props.category, token]);

  const handleScroll = useCallback(() => {
    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Throttle scroll events to prevent multiple rapid calls
    scrollTimeout.current = setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.offsetHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      // Trigger when user scrolls past 85% of the page or is 300px from bottom
      const shouldLoadMore = scrollPercentage > 85 || (scrollTop + windowHeight >= documentHeight - 300);
      
      if (shouldLoadMore) {
        // Check if we can load more articles - add more conditions to prevent multiple requests
        if (hasMore && !loading && !isLoadingMore.current && searchResults.length === 0 && !error && currentPageToken.current) {
          // Set loading flag immediately to prevent multiple requests
          isLoadingMore.current = true;
          
          // Use setTimeout to ensure the flag is set before the next request
          setTimeout(() => {
            updateNews(true);
          }, 100);
        }
      }
    }, 400); // Increased to 400ms throttle for better performance
  }, [hasMore, loading, searchResults.length, error]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up timeout on unmount
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  // Reset loading flag when page changes or when component unmounts
  useEffect(() => {
    return () => {
      isLoadingMore.current = false;
    };
  }, []);

  // Reset loading flag when articles are loaded
  useEffect(() => {
    if (!loading && !isLoadingMore.current) {
      isLoadingMore.current = false;
    }
  }, [loading]);

  const displayArticles = searchResults.length > 0 ? searchResults : articles;

  if (loading && !nextPageToken) {
    return (
      <div className="news-container">
        <div className="news-header">
          <h1 className="news-title">
            <i className="fas fa-newspaper"></i>
            {capitalizeFirstLetter(props.category)} News
          </h1>
          {newsSource && (
            <div className="news-source">
              <span>Source: {newsSource}</span>
            </div>
          )}
        </div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="news-container">
      <div className="news-header">
        <h1 className="news-title">
          <i className="fas fa-newspaper"></i>
          {searchResults.length > 0 ? 'Search Results' : capitalizeFirstLetter(props.category)} News
        </h1>
        {newsSource && searchResults.length === 0 && (
          <div className="news-source">
            <span>Source: {newsSource}</span>
          </div>
        )}
      </div>

      {/* Search Form */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${capitalizeFirstLetter(props.category)} news...`}
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={isSearching}>
            {isSearching ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
          </button>
        </form>
        {searchResults.length > 0 && (
          <button onClick={clearSearch} className="clear-search-button">
            <i className="fas fa-times"></i> Clear Search
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Articles Display */}
      <div className="articles-container">
        {displayArticles.length > 0 ? (
          <>
            {displayArticles.map((article, index) => (
              <NewsItem
                key={`${article.link}-${index}`}
                title={article.title}
                description={article.description}
                imageUrl={article.image_url}
                newsUrl={article.link}
                author={article.creator ? article.creator.join(', ') : 'Unknown'}
                date={article.pubDate}
                source={article.source_id}
              />
            ))}
            
            {/* Loading More Indicator */}
            {isLoadingMore.current && (
              <div className="loading-more">
                <Spinner />
                <p>Loading more articles...</p>
              </div>
            )}
            
            {/* End of Results */}
            {!hasMore && displayArticles.length > 0 && searchResults.length === 0 && (
              <div className="end-of-results">
                <i className="fas fa-check-circle"></i>
                <p>You've reached the end of the news feed!</p>
              </div>
            )}
          </>
        ) : (
          <div className="no-articles">
            <i className="fas fa-newspaper"></i>
            <p>
              {searchResults.length === 0 && !loading
                ? `No ${props.category} news available at the moment.`
                : 'No search results found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
