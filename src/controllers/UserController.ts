import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { userService } from '../services/UserService';
import { AppError } from '../middlewares/ErrorHandlerMiddleware';
import logger from '../utils/logger';

/**
 * Controller for users
 */
export class UserController {
  /**
   * Create a new user
   * @route POST /api/users
   */
  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
      }
      
      const userData = req.body;
      const user = await userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a user
   * @route PUT /api/users/:userId
   */
  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
      }
      
      const userId = req.params.userId;
      const userData = req.body;
      const user = await userService.updateUser(userId, userData);
      
      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change a user's password
   * @route PATCH /api/users/:userId/password
   */
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
      }
      
      const userId = req.params.userId;
      const passwordData = req.body;
      const user = await userService.changePassword(userId, passwordData);
      
      res.status(200).json({
        success: true,
        data: user,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Soft delete a user
   * @route DELETE /api/users/:userId
   */
  softDeleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
      }
      
      const userId = req.params.userId;
      const user = await userService.softDeleteUser(userId);
      
      res.status(200).json({
        success: true,
        data: user,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a user by query parameters
   * @route GET /api/users
   */
  getUserByQuery = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('Validation failed', 400, 'VALIDATION_ERROR');
      }
      
      const queryParams = {
        id: req.query.id as string | undefined,
        email: req.query.email as string | undefined,
        phone: req.query.phone as string | undefined,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      
      const user = await userService.getUserByQuery(queryParams);
      
      res.status(200).json({
        success: true,
        data: user,
        message: 'User retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export a singleton instance
export const userController = new UserController();
