import logger from '../utils/logger.js';

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      headers: req.headers
    });
    res.status(404);
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
  
    logger.error(`${statusCode} error: ${err.message}`, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.method !== 'GET' ? req.body : undefined,
      params: req.params,
      query: req.query,
      user: req.user ? req.user._id : undefined
    });
  
    res.json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      ...(process.env.NODE_ENV !== 'production' && {
        path: req.originalUrl,
        timestamp: new Date().toISOString(),
      })
    });
  };
  
  export { notFound, errorHandler };
  