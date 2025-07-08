const TOKEN_KEY = 'newsApp_token';
const USER_KEY = 'newsApp_user';

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const setUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user:', error);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

export const clearAuth = () => {
  removeAuthToken();
  removeUser();
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Basic token validation (you might want to add more sophisticated validation)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}; 