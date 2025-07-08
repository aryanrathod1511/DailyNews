import React from 'react';
import { getFallbackImage, handleImageError } from '../utils/imageUtils';
import { formatDate, truncateText, capitalizeFirstLetter } from '../utils/formatters';

const NewsItem =(props)=> {
    let { title, description, imageUrl, newsUrl, author, date, source, category} = props;
    return (
      <div className="news-item-container">
        <div className="news-card">
          <div className="card-image-container">
            <img 
              src={imageUrl || getFallbackImage(category)} 
              className="card-image" 
              alt={title || "News"} 
              onError={(e) => handleImageError(e, category)}
            />
            <div className="source-badge">
              <span className={`badge rounded-pill ${props.priority === 1 ? 'bg-success' : 'bg-danger'}`}>
                {source}
                {props.priority === 1 && <i className="fas fa-star ms-1"></i>}
              </span>
            </div>
          </div>
          <div className="card-content">
            <h5 className="card-title">{title || "No Title"}</h5>
            <p className="card-description">
              {description ? truncateText(description, 120) : "No description available"}
            </p>
            <div className="card-meta">
              <p className="card-author">
                <i className="fas fa-user"></i> {!author || author === "Unknown" ? "Anonymous" : capitalizeFirstLetter(author)}
              </p>
              <p className="card-date">
                <i className="fas fa-calendar"></i> {formatDate(date)}
              </p>
            </div>
            <a 
              rel="noreferrer" 
              href={newsUrl} 
              target="_blank" 
              className="read-more-btn"
            >
              <span>Read More</span>
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    )
}

export default NewsItem