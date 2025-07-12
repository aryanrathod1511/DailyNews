const User = require('../models/User');
const { ApiError } = require('../utils/apiError');

class AuthService {

  async registerUser({ name, email, password }) {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'User with this email already exists');
    }

   
    const user = new User({
      name,
      email,
      password
    });

    await user.save();


    const token = user.generateAuthToken();

    return {
      user: user.getProfile(),
      token
    };
  }


  async loginUser({ email, password }) {

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate token
    const token = user.generateAuthToken();

    return {
      user: user.getProfile(),
      token
    };
  }

  // Update user profile
  async updateUserProfile(userId, updateData) {
    const { name, email, avatar } = updateData;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (avatar) updateFields.avatar = avatar;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        throw new ApiError(400, 'Email is already taken');
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }

    return {
      user: updatedUser.getProfile()
    };
  }
}

module.exports = { AuthService }; 