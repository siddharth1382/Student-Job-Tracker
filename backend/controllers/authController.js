import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import logger from '../utils/logger.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  logger.debug('Register request received', { 
    body: { ...req.body, password: '[REDACTED]' } 
  });
  
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      logger.warn('Registration missing required fields', { 
        provided: { 
          name: !!name, 
          email: !!email, 
          password: !!password 
        } 
      });
      res.status(400);
      throw new Error('Please fill in all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      logger.warn('Registration attempted with existing email', { email });
      res.status(400);
      throw new Error('User already exists');
    }

    logger.info('Creating new user', { email, name });
    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(user._id);
      logger.info('User registered successfully', { userId: user._id });
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      logger.error('Failed to create user record', { email });
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    logger.error('Registration error', { 
      message: error.message, 
      stack: error.stack,
      statusCode: res.statusCode
    });
    
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message || 'Server Error',
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  logger.debug('Login request received', { 
    body: { ...req.body, password: '[REDACTED]' } 
  });
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warn('Login missing required fields', { 
        provided: { email: !!email, password: !!password } 
      });
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('Login attempted with non-existent email', { email });
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    
    if (isMatch) {
      const token = generateToken(user._id);
      logger.info('User logged in successfully', { userId: user._id });
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      logger.warn('Login attempted with incorrect password', { userId: user._id });
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    logger.error('Login error', { 
      message: error.message, 
      stack: error.stack,
      statusCode: res.statusCode
    });
    
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message || 'Server Error',
    });
  }
});
