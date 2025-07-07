import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const newsCategories = [
    { path: '/general', name: 'General', icon: 'fas fa-newspaper' },
    { path: '/politics', name: 'Politics', icon: 'fas fa-landmark' },
    { path: '/business', name: 'Business', icon: 'fas fa-briefcase' },
    { path: '/technology', name: 'Technology', icon: 'fas fa-microchip' },
    { path: '/sports', name: 'Sports', icon: 'fas fa-futbol' },
    { path: '/entertainment', name: 'Entertainment', icon: 'fas fa-film' },
    { path: '/health', name: 'Health', icon: 'fas fa-heartbeat' },
    { path: '/science', name: 'Science', icon: 'fas fa-flask' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Left Side */}
        <Link to="/" className="navbar-logo">
          <i className="fas fa-newspaper"></i>
          <span>NewsApp</span>
        </Link>

        {/* Desktop Menu - Center */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* News Categories */}
          <div className="navbar-categories">
            {newsCategories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={`navbar-link ${isActive(category.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className={category.icon}></i>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* User Menu - Right Side */}
        <div className="navbar-user-section">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <i className="fas fa-user-circle"></i>
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link
                to="/login"
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className={`navbar-link ${isActive('/register') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-user-plus"></i>
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
