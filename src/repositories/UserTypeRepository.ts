import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { userTypes } from '../db/schema';
import { UserTypeDto } from '../dtos/UserTypeDto';
import logger from '../utils/logger';

/**
 * Repository for user types
 */
export class UserTypeRepository {
  /**
   * Find all user types
   * @returns Array of user types
   */
  async findAll(): Promise<UserTypeDto[]> {
    try {
      const result = await db.select().from(userTypes);
      return result;
    } catch (error) {
      logger.error('Error finding all user types:', error);
      throw error;
    }
  }

  /**
   * Find a user type by ID
   * @param id User type ID
   * @returns User type or null if not found
   */
  async findById(id: number): Promise<UserTypeDto | null> {
    try {
      const result = await db
        .select()
        .from(userTypes)
        .where(eq(userTypes.id, id))
        .limit(1);
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      logger.error(`Error finding user type with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if a user type exists
   * @param id User type ID
   * @returns True if the user type exists, false otherwise
   */
  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.findById(id);
      return result !== null;
    } catch (error) {
      logger.error(`Error checking if user type with ID ${id} exists:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const userTypeRepository = new UserTypeRepository();
