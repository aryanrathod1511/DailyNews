import React, { useState, useEffect, useCallback, useRef } from 'react';
import NewsItem from '../NewsItem';
import Spinner from '../Spinner';
import SearchBar from './SearchBar';
import { useNews } from '../../hooks/useNews';
import { useSearch } from '../../hooks/useSearch';
import { getCategoryConfig } from '../../constants/categories';
import { formatRelativeTime } from '../../utils/formatters';
import { filterUniqueArticles } from '../../utils/newsUtils';

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

  // LIFT useSearch hook to here
  const {
    searchQuery,
    searchResults,
    isSearching: searchLoading,
    error: searchError,
    handleSearch,
    clearSearch,
    updateSearchQuery,
    performSearch
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

  // Handle search query changes
  const handleSearchQueryChange = useCallback((query) => {
    updateSearchQuery(query);
    // Exit search mode when query is cleared
    if (!query.trim()) {
      setIsSearchMode(false);
    }
  }, [updateSearchQuery]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    clearSearch();
    setIsSearchMode(false);
  }, [clearSearch]);

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
    <div className="w-11/12 mx-auto p-5 relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 py-8 bg-header-gradient text-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-4">
          <i className={`${categoryConfig.icon} text-3xl opacity-90`}></i>
          {categoryConfig.label} News
        </h1>
        <div className="flex flex-col gap-2 items-center">
          {newsSource && (
            <p className="text-lg opacity-80 italic">
              Powered by {newsSource}
            </p>
          )}
          {displayArticles.length > 0 && (
            <p className="flex items-center gap-2 text-sm opacity-90 bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-sm flex-wrap justify-center">
              <i className="fas fa-newspaper"></i>
              Showing {displayArticles.length} unique articles
              {duplicatesFiltered > 0 && (
                <span className="flex items-center gap-1 text-yellow-300 text-xs opacity-80">
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
        searchQuery={searchQuery}
        isSearching={searchLoading}
        handleSearch={handleSearch}
        clearSearch={handleClearSearch}
        updateSearchQuery={handleSearchQueryChange}
        onSearchResults={handleSearchResults}
      />

      {/* Error Display */}
      {currentError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-lg mb-4">
            <i className="fas fa-exclamation-triangle"></i>
            {currentError}
          </div>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 mx-auto"
            onClick={resetNews}
          >
            <i className="fas fa-redo"></i>
            Retry
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {currentLoading && displayArticles.length === 0 && (
        <div className="flex justify-center items-center min-h-80">
          <Spinner />
        </div>
      )}

      {/* News Grid */}
      {displayArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full">
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
        <div className="text-center py-16 text-gray-600">
          <i className="fas fa-search text-6xl mb-4 opacity-50"></i>
          <h3 className="text-2xl mb-4 text-gray-700">No articles found</h3>
          <p className="text-lg leading-relaxed">
            {isSearchMode 
              ? 'Try adjusting your search terms or browse other categories.'
              : 'No articles available for this category at the moment.'
            }
          </p>
        </div>
      )}

      {/* Load More Indicator */}
      {hasMore && !isSearchMode && displayArticles.length > 0 && (
        <div className="scroll-sentinel mt-8 text-center">
          {loading && (
            <div className="flex items-center justify-center gap-4 py-8 text-gray-600 text-lg">
              <Spinner />
              <span>Loading more articles...</span>
            </div>
          )}
        </div>
      )}

      {/* Back to Top Button */}
      {progress > 20 && (
        <button 
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 shadow-lg hover:-translate-y-1 z-50 flex items-center justify-center"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default NewsContainer; 