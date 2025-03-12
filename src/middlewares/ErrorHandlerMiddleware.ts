import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import logger from '../utils/logger';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  code: string;
  
  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandlerMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack || '');
  
  // Default error response
  const statusCode = (err as AppError).statusCode || 500;
  const errorCode = (err as AppError).code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Something went wrong';
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
};

// Validation error handler middleware
export const validationErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));
    
    logger.error(`Validation errors: ${JSON.stringify(errorMessages)}`);
    
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errorMessages,
      },
    });
    return;
  }
  
  next();
};

// Not found handler middleware
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  logger.error(`Route not found: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
};
