import React from 'react';
import { useSearch } from '../../hooks/useSearch';
import './SearchBar.css';

const SearchBar = ({ category, onSearchResults }) => {
  const {
    searchQuery,
    isSearching,
    handleSearch,
    clearSearch,
    updateSearchQuery
  } = useSearch(category);

  const handleSubmit = (e) => {
    handleSearch(e);
    // You can add callback here if needed
  };

  const handleClear = () => {
    clearSearch();
    if (onSearchResults) {
      onSearchResults([]);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
            disabled={isSearching}
          />
          <button
            type="submit"
            className="search-button"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
          {searchQuery && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              disabled={isSearching}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 