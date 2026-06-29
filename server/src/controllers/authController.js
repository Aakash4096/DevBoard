const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const registerUser = async (req, res, next) => {
  console.log("registerUser called");
  console.log("next type:", typeof next);
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      throw new ApiError(400, "Please provide name, email, and password");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, `User with email ${email} already exists`);
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if both fields provided
    if (!email || !password) {
      throw new ApiError(400, "Please provide email and password");
    }

    // Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { registerUser, loginUser };
