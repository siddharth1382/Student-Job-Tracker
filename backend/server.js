import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './utils/logger.js';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables early
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('MongoDB Connected', { uri: process.env.MONGO_URI.split('@')[1] });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', { 
      error: err.message,
      stack: err.stack 
    });
    process.exit(1);
  });

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://student-job-tracker-brown.vercel.app' // 👈 add your Vercel frontend URL here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// Request logging
app.use(logger.requestLogger);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Debug incoming requests
app.use((req, res, next) => {
  logger.debug(`[testing] Incoming request: ${req.method} ${req.originalUrl}`, {
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Log body for debugging - don't do this in production!
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    logger.debug(`[testing] Request body`, { 
      url: req.originalUrl, 
      method: req.method,
      body: req.body 
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check endpoint - placed after routes but before error handlers
app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// Health check handler function
function healthCheck(req, res) {
  try {
    const healthData = {
      success: true,
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    
    logger.info('Health check requested', { healthData, path: req.path });
    return res.status(200).json(healthData);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    return res.status(500).json({ 
      success: false, 
      status: 'DOWN',
      message: 'Health check failed', 
      error: error.message 
    });
  }
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Enhanced error handlers in errorMiddleware.js

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { 
    port: PORT, 
    env: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI ? 'Connected' : 'Not connected',
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set' 
  });
});
