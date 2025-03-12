import { Request, Response, NextFunction } from 'express';
import { userTypeService } from '../services/UserTypeService';
import logger from '../utils/logger';

/**
 * Controller for user types
 */
export class UserTypeController {
  /**
   * Get all user types
   * @route GET /api/user-types
   */
  getAllUserTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userTypes = await userTypeService.getAllUserTypes();
      
      res.status(200).json({
        success: true,
        data: userTypes,
        message: 'User types retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export a singleton instance
export const userTypeController = new UserTypeController();
