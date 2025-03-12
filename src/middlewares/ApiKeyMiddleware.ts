import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import logger from '../utils/logger';

/**
 * Middleware to validate API key
 */
export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const apiKey = req.headers['x-api-key'];
  
  // Check if API key is provided
  if (!apiKey) {
    logger.error('API key missing');
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'API key is required',
      },
    });
  }
  
  // Check if API key is valid
  if (apiKey !== config.security.apiKey) {
    logger.error('Invalid API key');
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid API key',
      },
    });
  }
  
  // API key is valid, proceed to next middleware
  return next();
};
