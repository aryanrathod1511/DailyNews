import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken, setUser, removeUser } from '../utils/auth';
import { apiService } from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: getAuthToken(),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  LOAD_USER: 'LOAD_USER'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      setAuthToken(action.payload.token);
      setUser(action.payload.user);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAIL:
    case AUTH_ACTIONS.LOGOUT:
      removeAuthToken();
      removeUser();
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload || null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const data = await apiService.getProfile();
          dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: data.data.user });
        } catch (error) {
          console.error('Load user error:', error);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []); // Only run once on mount

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const data = await apiService.login({ email, password });

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: data.data.user,
          token: data.data.token
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: error.message || 'Network error. Please try again.'
      });
      return { success: false, message: error.message || 'Network error. Please try again.' };
    }
  }, []);

  // Register function
  const register = useCallback(async (name, email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const data = await apiService.register({ name, email, password });

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: data.data.user,
          token: data.data.token
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: error.message || 'Network error. Please try again.'
      });
      return { success: false, message: error.message || 'Network error. Please try again.' };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Get auth headers for API calls
  const getAuthHeaders = useCallback(() => {
    return {
      'Authorization': `Bearer ${state.token}`,
      'Content-Type': 'application/json'
    };
  }, [state.token]);

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 