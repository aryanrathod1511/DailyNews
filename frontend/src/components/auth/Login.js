import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, error, clearError, loading } = useAuth();
  const history = useHistory();

  useEffect(() => {
    clearError();
  }, []); // Only run once on mount

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      history.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-loginBg flex items-center justify-center p-4">
      <div className="bg-cardBg rounded-2xl shadow-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cardText mb-2 flex items-center justify-center gap-3">
            <i className="fas fa-sign-in-alt text-cardText"></i>
            Welcome Back
          </h2>
          <p className="text-gray-500">Sign in to access your personalized news feed</p>
        </div>

        {error && (
          <div className="bg-errorBg text-errorText px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cardText mb-2 flex items-center gap-2">
              <i className="fas fa-envelope text-cardText"></i>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-none rounded-lg bg-inputBg focus:ring-2 focus:ring-headerEnd focus:border-transparent transition-colors duration-200 text-cardText ${
                errors.email ? 'ring-2 ring-errorText' : ''
              }`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <div className="text-errorText text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-cardText mb-2 flex items-center gap-2">
              <i className="fas fa-lock text-cardText"></i>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border-none rounded-lg bg-inputBg focus:ring-2 focus:ring-headerEnd focus:border-transparent transition-colors duration-200 text-cardText ${
                  errors.password ? 'ring-2 ring-errorText' : ''
                }`}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cardText transition-colors duration-200 disabled:opacity-50"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.password && (
              <div className="text-errorText text-sm mt-1">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-loginBtn hover:bg-loginBtnHover text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            disabled={loading}
          >
            <i className="fas fa-sign-in-alt"></i>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-headerEnd hover:text-headerStart font-semibold transition-colors duration-200">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 