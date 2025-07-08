import React from 'react';
import { getFallbackImage, handleImageError } from '../utils/imageUtils';
import { formatDate, truncateText, capitalizeFirstLetter } from '../utils/formatters';

const NewsItem = (props) => {
  let { title, description, imageUrl, newsUrl, author, date, source, category } = props;
  
  return (
    <div className="w-full h-full">
      <a
        href={newsUrl}
        target="_blank"
        rel="noreferrer"
        className="block h-full group focus:outline-none focus:ring-2 focus:ring-headerEnd rounded-2xl"
        tabIndex={0}
        aria-label={title || 'News article'}
      >
        <div className="bg-cardBg rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 h-full flex flex-col relative border border-gray-100">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={imageUrl || getFallbackImage(category)} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              alt={title || "News"} 
              onError={(e) => handleImageError(e, category)}
            />
            <div className="absolute top-3 right-3 z-10">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg transition-all duration-300 ${
                props.priority === 1 
                  ? 'bg-badge-green text-white animate-pulse' 
                  : 'bg-badge-red text-white'
              }`}>
                {source}
                {props.priority === 1 && <i className="fas fa-star ml-1"></i>}
              </span>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-between">
            <h5 className="text-lg font-bold text-cardText mb-3 line-clamp-3 leading-relaxed transition-colors duration-300 group-hover:text-gray-900">
              {title || "No Title"}
            </h5>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-1">
              {description ? truncateText(description, 120) : "No description available"}
            </p>
            
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                <i className="fas fa-user text-gray-400 w-4"></i>
                {!author || author === "Unknown" ? "Anonymous" : capitalizeFirstLetter(author)}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <i className="fas fa-calendar text-gray-400 w-4"></i>
                {formatDate(date)}
              </p>
            </div>
            
            <span
              className="inline-flex items-center justify-between bg-navbar text-white px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer select-none"
              tabIndex={-1}
            >
              <span>Read More</span>
              <i className="fas fa-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-1"></i>
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default NewsItem;