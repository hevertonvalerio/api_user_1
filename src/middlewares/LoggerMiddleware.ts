import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Middleware to log HTTP requests
 */
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  // Get the start time
  const start = Date.now();
  
  // Log the request
  logger.http(`${req.method} ${req.originalUrl}`);
  
  // Add a listener for when the response is finished
  res.on('finish', () => {
    // Calculate the response time
    const responseTime = Date.now() - start;
    
    // Log the response
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`
    );
  });
  
  // Call the next middleware
  next();
};
