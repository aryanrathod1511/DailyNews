import React from 'react';

const SearchBar = ({ category, searchQuery, isSearching, handleSearch, clearSearch, updateSearchQuery, onSearchResults }) => {
  const handleSubmit = (e) => {
    handleSearch(e, onSearchResults);
  };

  return (
    <div className="mb-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative flex items-center bg-white rounded-full shadow-lg overflow-hidden transition-all duration-300 focus-within:shadow-xl focus-within:-translate-y-1">
          <input
            type="text"
            className="flex-1 px-5 py-3 border-none outline-none text-base bg-transparent placeholder-gray-500 placeholder-italic"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
            disabled={isSearching}
          />
          <button
            type="submit"
            className={`w-12 h-12 m-1 transition-colors duration-200 flex items-center justify-center bg-navbar text-white font-bold rounded-full hover:text-gold focus:text-gold disabled:bg-gray-300 disabled:cursor-not-allowed`}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 