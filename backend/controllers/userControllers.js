const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const {
    name,
    username,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
    bio,
    address,
    profile_picture,
  } = req.body;

  try {
    logger.info('User signup attempt', { username });
    if (
      !name ||
      !username ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status ||
      !address
    ) {
      logger.warn('Signup failed - missing required fields', { username });
      res.status(400);
      throw new Error("Please add all required fields");
    }

    // Check if user exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      logger.warn('Signup failed - username already exists', { username });
      res.status(400);
      throw new Error("User with this username already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      phone_number,
      gender,
      date_of_birth,
      membership_status,
      bio,
      address,
      profile_picture,
    });

    if (user) {
      const token = generateToken(user._id);
      logger.info('User created successfully', { userId: user._id, username });
      res.status(201).json({ username, token });
    } else {
      logger.error('Failed to create user', { username });
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    logger.error('Signup error', { username, error: error.message });
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    logger.info('User login attempt', { username });
    // Check for username
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      logger.info('User logged in successfully', { userId: user._id, username });
      res.status(200).json({ username: user.username, token });
    } else {
      logger.warn('Login failed - invalid credentials', { username });
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    logger.error('Login error', { username, error: error.message });
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    logger.info('Fetching user profile', { userId: req.user._id });
    res.status(200).json(req.user);
  } catch (error) {
    logger.error('Error fetching user profile', { userId: req.user._id, error: error.message });
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};
