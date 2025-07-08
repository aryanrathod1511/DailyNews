import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useHistory } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register, error, clearError, loading } = useAuth();
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

    // Check password strength
    if (e.target.name === 'password') {
      const strength = calculatePasswordStrength(e.target.value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return { text: 'Weak', color: 'red' };
    if (passwordStrength <= 4) return { text: 'Fair', color: 'yellow' };
    if (passwordStrength <= 5) return { text: 'Good', color: 'blue' };
    return { text: 'Strong', color: 'green' };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      history.push('/');
    }
  };

  const strengthInfo = getPasswordStrengthText();

  return (
    <div className="min-h-screen bg-loginBg flex items-center justify-center p-4">
      <div className="bg-cardBg rounded-2xl shadow-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cardText mb-2 flex items-center justify-center gap-3">
            <i className="fas fa-user-plus text-cardText"></i>
            Create Account
          </h2>
          <p className="text-gray-500">Join Samachar to get personalized news updates</p>
        </div>

        {error && (
          <div className="bg-errorBg text-errorText px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-cardText mb-2 flex items-center gap-2">
              <i className="fas fa-user text-cardText"></i>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-none rounded-lg bg-inputBg focus:ring-2 focus:ring-headerEnd focus:border-transparent transition-colors duration-200 text-cardText ${
                errors.name ? 'ring-2 ring-errorText' : ''
              }`}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.name && (
              <div className="text-errorText text-sm mt-1">{errors.name}</div>
            )}
          </div>

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
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        strengthInfo.color === 'red' ? 'bg-errorText' :
                        strengthInfo.color === 'yellow' ? 'bg-yellow-500' :
                        strengthInfo.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 6) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${
                    strengthInfo.color === 'red' ? 'text-errorText' :
                    strengthInfo.color === 'yellow' ? 'text-yellow-600' :
                    strengthInfo.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {strengthInfo.text}
                  </span>
                </div>
              </div>
            )}
            {errors.password && (
              <div className="text-errorText text-sm mt-1">{errors.password}</div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-cardText mb-2 flex items-center gap-2">
              <i className="fas fa-lock text-cardText"></i>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border-none rounded-lg bg-inputBg focus:ring-2 focus:ring-headerEnd focus:border-transparent transition-colors duration-200 text-cardText ${
                  errors.confirmPassword ? 'ring-2 ring-errorText' : ''
                }`}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cardText transition-colors duration-200 disabled:opacity-50"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="text-errorText text-sm mt-1">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-loginBtn hover:bg-loginBtnHover text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <i className="fas fa-user-plus"></i>
                Create Account
              </div>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-headerEnd hover:text-headerStart font-semibold transition-colors duration-200">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 