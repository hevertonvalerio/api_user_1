import { UserTypeDto } from '../dtos/UserTypeDto';
import { AppError } from '../middlewares/ErrorHandlerMiddleware';
import { userTypeRepository } from '../repositories/UserTypeRepository';
import logger from '../utils/logger';

/**
 * Service for user types
 */
export class UserTypeService {
  /**
   * Get all user types
   * @returns Array of user types
   */
  async getAllUserTypes(): Promise<UserTypeDto[]> {
    try {
      logger.info('Getting all user types');
      return await userTypeRepository.findAll();
    } catch (error) {
      logger.error('Error getting all user types:', error);
      throw new AppError('Failed to get user types', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Get a user type by ID
   * @param id User type ID
   * @returns User type
   * @throws AppError if user type not found
   */
  async getUserTypeById(id: number): Promise<UserTypeDto> {
    try {
      logger.info(`Getting user type with ID ${id}`);
      
      const userType = await userTypeRepository.findById(id);
      
      if (!userType) {
        throw new AppError(`User type with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      return userType;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error(`Error getting user type with ID ${id}:`, error);
      throw new AppError('Failed to get user type', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Check if a user type exists
   * @param id User type ID
   * @returns True if the user type exists, false otherwise
   */
  async userTypeExists(id: number): Promise<boolean> {
    try {
      logger.info(`Checking if user type with ID ${id} exists`);
      return await userTypeRepository.exists(id);
    } catch (error) {
      logger.error(`Error checking if user type with ID ${id} exists:`, error);
      throw new AppError('Failed to check if user type exists', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
}

// Export a singleton instance
export const userTypeService = new UserTypeService();
