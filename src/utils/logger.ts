import winston from 'winston';
import { config } from '../config';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = config.server.nodeEnv || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(colors);

// Define the format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports for logs
const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // File transport for all logs
  new winston.transports.File({
    filename: 'logs/combined.log',
  }),
  
  // File transport for error logs
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
