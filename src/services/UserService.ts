import { CreateUserDto, UpdateUserDto, UserDto, UserQueryDto, ChangePasswordDto } from '../dtos/UserDto';
import { AppError } from '../middlewares/ErrorHandlerMiddleware';
import { userRepository } from '../repositories/UserRepository';
import { userTypeService } from './UserTypeService';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import logger from '../utils/logger';

/**
 * Service for users
 */
export class UserService {
  /**
   * Create a new user
   * @param userData User data
   * @returns Created user
   * @throws AppError if email already exists or user type doesn't exist
   */
  async createUser(userData: CreateUserDto): Promise<UserDto> {
    try {
      logger.info(`Creating user with email ${userData.email}`);
      
      // Check if email already exists
      const emailExists = await userRepository.existsByEmail(userData.email);
      if (emailExists) {
        throw new AppError(`User with email ${userData.email} already exists`, 400, 'EMAIL_ALREADY_EXISTS');
      }
      
      // Check if user type exists
      const userTypeExists = await userTypeService.userTypeExists(userData.userTypeId);
      if (!userTypeExists) {
        throw new AppError(`User type with ID ${userData.userTypeId} not found`, 400, 'USER_TYPE_NOT_FOUND');
      }
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user
      const user = await userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      
      logger.info(`User created with ID ${user.id}`);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as UserDto;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error('Error creating user:', error);
      throw new AppError('Failed to create user', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Update a user
   * @param id User ID
   * @param userData User data
   * @returns Updated user
   * @throws AppError if user not found, email already exists, or user type doesn't exist
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<UserDto> {
    try {
      logger.info(`Updating user with ID ${id}`);
      
      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        throw new AppError(`User with ID ${id} not found`, 404, 'USER_NOT_FOUND');
      }
      
      // Check if email already exists (if changing email)
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await userRepository.existsByEmail(userData.email, id);
        if (emailExists) {
          throw new AppError(`User with email ${userData.email} already exists`, 400, 'EMAIL_ALREADY_EXISTS');
        }
      }
      
      // Check if user type exists (if changing user type)
      if (userData.userTypeId && userData.userTypeId !== existingUser.userTypeId) {
        const userTypeExists = await userTypeService.userTypeExists(userData.userTypeId);
        if (!userTypeExists) {
          throw new AppError(`User type with ID ${userData.userTypeId} not found`, 400, 'USER_TYPE_NOT_FOUND');
        }
      }
      
      // Update user
      const updatedUser = await userRepository.update(id, userData);
      if (!updatedUser) {
        throw new AppError(`Failed to update user with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
      
      logger.info(`User with ID ${id} updated`);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as UserDto;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error(`Error updating user with ID ${id}:`, error);
      throw new AppError('Failed to update user', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Change a user's password
   * @param id User ID
   * @param passwordData Password data
   * @returns Updated user
   * @throws AppError if user not found or current password is invalid
   */
  async changePassword(id: string, passwordData: ChangePasswordDto): Promise<UserDto> {
    try {
      logger.info(`Changing password for user with ID ${id}`);
      
      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        throw new AppError(`User with ID ${id} not found`, 404, 'USER_NOT_FOUND');
      }
      
      // Check if current password is valid
      const isPasswordValid = await comparePassword(passwordData.currentPassword, existingUser.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is invalid', 400, 'INVALID_PASSWORD');
      }
      
      // Check if new password and confirm password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new AppError('New password and confirm password do not match', 400, 'PASSWORDS_DO_NOT_MATCH');
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(passwordData.newPassword);
      
      // Update password
      const updatedUser = await userRepository.updatePassword(id, hashedPassword);
      if (!updatedUser) {
        throw new AppError(`Failed to update password for user with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
      
      logger.info(`Password changed for user with ID ${id}`);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword as UserDto;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error(`Error changing password for user with ID ${id}:`, error);
      throw new AppError('Failed to change password', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Soft delete a user
   * @param id User ID
   * @returns Deleted user
   * @throws AppError if user not found
   */
  async softDeleteUser(id: string): Promise<UserDto> {
    try {
      logger.info(`Soft deleting user with ID ${id}`);
      
      // Check if user exists
      const existingUser = await userRepository.findById(id);
      if (!existingUser) {
        throw new AppError(`User with ID ${id} not found`, 404, 'USER_NOT_FOUND');
      }
      
      // Soft delete user
      const deletedUser = await userRepository.softDelete(id);
      if (!deletedUser) {
        throw new AppError(`Failed to delete user with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
      
      logger.info(`User with ID ${id} soft deleted`);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = deletedUser;
      return userWithoutPassword as UserDto;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error(`Error soft deleting user with ID ${id}:`, error);
      throw new AppError('Failed to delete user', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Get a user by query parameters
   * @param queryParams Query parameters
   * @returns User
   * @throws AppError if user not found or no query parameters provided
   */
  async getUserByQuery(queryParams: UserQueryDto): Promise<UserDto> {
    try {
      logger.info(`Getting user by query: ${JSON.stringify(queryParams)}`);
      
      // Check if at least one query parameter is provided
      const { id, email, phone } = queryParams;
      if (!id && !email && !phone) {
        throw new AppError('At least one query parameter (id, email, or phone) is required', 400, 'MISSING_QUERY_PARAMS');
      }
      
      // Get user
      const user = await userRepository.findByQuery(queryParams);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      
      logger.info(`User found with ID ${user.id}`);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as UserDto;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error('Error getting user by query:', error);
      throw new AppError('Failed to get user', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
}

// Export a singleton instance
export const userService = new UserService();
