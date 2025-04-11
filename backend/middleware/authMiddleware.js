import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  logger.debug('Checking authentication headers', { 
    url: req.originalUrl, 
    headers: req.headers.authorization ? 'Authorization header present' : 'No Authorization header' 
  });

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      logger.debug('Token extracted from header', { url: req.originalUrl });
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.debug('Token verified successfully', { userId: decoded.userId });

      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        logger.error('User not found for token', { userId: decoded.userId });
        res.status(401);
        throw new Error('User not found');
      }
      
      logger.debug('User attached to request', { userId: req.user._id, route: req.originalUrl });
      next();
      return; // Added return to prevent further execution
    } catch (error) {
      logger.error('Token verification failed', { 
        error: error.message,
        stack: error.stack,
        token: token ? 'Token present' : 'No token'
      });
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    logger.error('No token provided', { url: req.originalUrl, method: req.method });
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
