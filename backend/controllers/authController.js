
const { AuthService } = require('../services/authService');
const { ApiResponse } = require('../utils/apiResponse');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {


      const { name, email, password } = req.body;

      const result = await this.authService.registerUser({ name, email, password });

      return ApiResponse.created(res, 'User registered successfully', result);

    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  };


  login = async (req, res, next) => {
    try {


      const { email, password } = req.body;

      const result = await this.authService.loginUser({ email, password });

      return ApiResponse.success(res, 'Login successful', result);

    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  };

 
  getProfile = async (req, res, next) => {
    try {
      const user = req.user.getProfile();
      return ApiResponse.success(res, 'Profile retrieved successfully', { user });

    } catch (error) {
      console.error('Get profile error:', error);
      next(error);
    }
  };

 
  updateProfile = async (req, res, next) => {
    try {


      const { name, email, avatar } = req.body;
      const userId = req.user.id;

      const result = await this.authService.updateUserProfile(userId, { name, email, avatar });

      return ApiResponse.success(res, 'Profile updated successfully', result);

    } catch (error) {
      console.error('Update profile error:', error);
      next(error);
    }
  };


  logout = async (req, res, next) => {
    try {

      return ApiResponse.success(res, 'Logged out successfully');

    } catch (error) {
      console.error('Logout error:', error);
      next(error);
    }
  };
}

module.exports = { AuthController }; 