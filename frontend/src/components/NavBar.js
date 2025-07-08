import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <nav className="bg-navbar shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-gold transition-colors duration-200">
            <i className="fas fa-newspaper text-2xl"></i>
            <span className="text-xl font-bold">NewsApp</span>
          </Link>

          {/* Desktop Menu - Center */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-navbar md:bg-transparent`}>
            {/* News Categories */}
            <div className="flex flex-col md:flex-row md:space-x-1">
              {newsCategories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(category.path)
                      ? 'bg-navbar text-gold shadow-glow'
                      : 'text-gray-100 hover:text-gold hover:bg-navbar'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={category.icon}></i>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu - Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-100">
                  <i className="fas fa-user-circle text-xl"></i>
                  <span className="hidden sm:block font-medium">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 bg-primaryBtn hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/login')
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-100 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span className="hidden sm:block">Login</span>
                </Link>
                <Link
                  to="/register"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/register')
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-100 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-user-plus"></i>
                  <span className="hidden sm:block">Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white hover:text-gray-200 transition-colors duration-200"
            onClick={toggleMenu}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
