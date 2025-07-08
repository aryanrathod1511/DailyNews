import React, { useState, useEffect, useCallback, useRef } from 'react';
import NewsItem from '../NewsItem';
import Spinner from '../Spinner';
import SearchBar from './SearchBar';
import { useNews } from '../../hooks/useNews';
import { useSearch } from '../../hooks/useSearch';
import { getCategoryConfig } from '../../constants/categories';
import { formatRelativeTime } from '../../utils/formatters';
import { filterUniqueArticles } from '../../utils/newsUtils';
import './NewsContainer.css';

const NewsContainer = ({ category = 'general' }) => {
  const [progress, setProgress] = useState(0);
  const [displayArticles, setDisplayArticles] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [duplicatesFiltered, setDuplicatesFiltered] = useState(0);
  
  // Fixed deduplication settings (no UI controls)
  const deduplicationEnabled = true;
  const similarityThreshold = 0.7;
  
  // Use custom hooks for news and search functionality
  const {
    articles,
    loading,
    error,
    hasMore,
    newsSource,
    loadMore,
    resetNews
  } = useNews(category);

  const {
    searchResults,
    isSearching: searchLoading,
    error: searchError
  } = useSearch(category);
  
  // Refs for scroll handling
  const scrollTimeout = useRef(null);
  const observerRef = useRef(null);

  // Update display articles based on mode
  useEffect(() => {
    if (isSearchMode) {
      const filteredResults = deduplicationEnabled 
        ? filterUniqueArticles(searchResults, similarityThreshold)
        : searchResults;
      setDisplayArticles(filteredResults);
      setDuplicatesFiltered(searchResults.length - filteredResults.length);
    } else {
      const filteredArticles = deduplicationEnabled 
        ? filterUniqueArticles(articles, similarityThreshold)
        : articles;
      setDisplayArticles(filteredArticles);
      setDuplicatesFiltered(articles.length - filteredArticles.length);
    }
  }, [isSearchMode, searchResults, articles, deduplicationEnabled, similarityThreshold]);

  // Handle search results
  const handleSearchResults = useCallback((results) => {
    setIsSearchMode(results && results.length > 0);
  }, []);

  // Scroll handling for infinite scroll
  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.offsetHeight;
      
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(scrollPercentage);
      
      // Load more when user scrolls past 85% and not in search mode
      if (scrollPercentage > 85 && hasMore && !isSearchMode && !loading) {
        loadMore();
      }
    }, 100);
  }, [hasMore, isSearchMode, loading, loadMore]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  // Intersection Observer for better performance
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isSearchMode && !loading) {
            loadMore();
          }
        });
      },
      { threshold: 0.1 }
    );

    const sentinel = document.querySelector('.scroll-sentinel');
    if (sentinel) {
      observerRef.current.observe(sentinel);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isSearchMode, loading, loadMore]);

  // Reset search mode when category changes
  useEffect(() => {
    setIsSearchMode(false);
  }, [category]);

  const categoryConfig = getCategoryConfig(category);
  const currentError = isSearchMode ? searchError : error;
  const currentLoading = isSearchMode ? searchLoading : loading;

  return (
    <div className="news-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="news-header">
        <h1 className="category-title">
          <i className={categoryConfig.icon}></i>
          {categoryConfig.label} News
        </h1>
        <div className="news-meta">
          {newsSource && (
            <p className="news-source">
              Powered by {newsSource}
            </p>
          )}
          {displayArticles.length > 0 && (
            <p className="articles-count">
              <i className="fas fa-newspaper"></i>
              Showing {displayArticles.length} unique articles
              {duplicatesFiltered > 0 && (
                <span className="duplicates-info">
                  <i className="fas fa-filter"></i>
                  {duplicatesFiltered} duplicates filtered
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar 
        category={category} 
        onSearchResults={handleSearchResults}
      />

      {/* Error Display */}
      {currentError && (
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {currentError}
          </div>
          <button 
            className="retry-button"
            onClick={resetNews}
          >
            <i className="fas fa-redo"></i>
            Retry
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {currentLoading && displayArticles.length === 0 && (
        <div className="loading-container">
          <Spinner />
        </div>
      )}

      {/* News Grid */}
      {displayArticles.length > 0 && (
        <div className="news-grid">
          {displayArticles.map((article, index) => (
            <NewsItem
              key={`${article.link}-${index}`}
              title={article.title}
              description={article.description}
              imageUrl={article.image_url}
              newsUrl={article.link}
              author={article.creator?.[0]}
              date={article.pubDate}
              source={article.source_id}
              category={article.category}
              priority={article.priority}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!currentLoading && displayArticles.length === 0 && !currentError && (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>No articles found</h3>
          <p>
            {isSearchMode 
              ? 'Try adjusting your search terms or browse other categories.'
              : 'No articles available for this category at the moment.'
            }
          </p>
        </div>
      )}

      {/* Load More Indicator */}
      {hasMore && !isSearchMode && displayArticles.length > 0 && (
        <div className="scroll-sentinel">
          {loading && (
            <div className="load-more-indicator">
              <Spinner />
              <span>Loading more articles...</span>
            </div>
          )}
        </div>
      )}

      {/* Back to Top Button */}
      {progress > 20 && (
        <button 
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default NewsContainer; 