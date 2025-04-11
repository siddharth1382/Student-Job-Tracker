import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const errorLogPath = path.join(logsDir, 'error.log');
const accessLogPath = path.join(logsDir, 'access.log');

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Format date for logs
const formatDate = () => {
  return new Date().toISOString();
};

// Write to log file
const writeToFile = (filePath, message) => {
  const timestamp = formatDate();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  fs.appendFile(filePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// Log to console and file
const log = (level, message, details = null) => {
  const timestamp = formatDate();
  const detailsStr = details ? JSON.stringify(details, null, 2) : '';
  
  // Format console output
  let consoleMessage = `[${timestamp}] [${level}] ${message}`;
  if (details) {
    consoleMessage += `\n${detailsStr}`;
  }
  
  // Console logging with colors
  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error('\x1b[31m%s\x1b[0m', consoleMessage); // Red
      writeToFile(errorLogPath, `[${level}] ${message} ${detailsStr}`);
      break;
    case LOG_LEVELS.WARN:
      console.warn('\x1b[33m%s\x1b[0m', consoleMessage); // Yellow
      writeToFile(errorLogPath, `[${level}] ${message} ${detailsStr}`);
      break;
    case LOG_LEVELS.INFO:
      console.info('\x1b[36m%s\x1b[0m', consoleMessage); // Cyan
      writeToFile(accessLogPath, `[${level}] ${message} ${detailsStr}`);
      break;
    case LOG_LEVELS.DEBUG:
      console.debug('\x1b[90m%s\x1b[0m', consoleMessage); // Gray
      writeToFile(accessLogPath, `[${level}] ${message} ${detailsStr}`);
      break;
    default:
      console.log(consoleMessage);
      writeToFile(accessLogPath, `[INFO] ${message} ${detailsStr}`);
  }
};

// Public API
const logger = {
  error: (message, details = null) => log(LOG_LEVELS.ERROR, message, details),
  warn: (message, details = null) => log(LOG_LEVELS.WARN, message, details),
  info: (message, details = null) => log(LOG_LEVELS.INFO, message, details),
  debug: (message, details = null) => log(LOG_LEVELS.DEBUG, message, details),
  
  // Request logger middleware
  requestLogger: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logLevel = res.statusCode >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
      
      log(logLevel, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        ...(req.user ? { userId: req.user._id } : {})
      });
    });
    
    next();
  }
};

export default logger; 