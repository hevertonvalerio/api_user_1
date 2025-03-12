import { and, eq, isNull, ne, or } from 'drizzle-orm';
import { db } from '../db/client';
import { users, userTypes } from '../db/schema';
import { CreateUserDto, UpdateUserDto, UserDto, UserQueryDto } from '../dtos/UserDto';
import logger from '../utils/logger';

/**
 * Repository for users
 */
export class UserRepository {
  /**
   * Create a new user
   * @param userData User data
   * @returns Created user
   */
  async create(userData: CreateUserDto): Promise<UserDto> {
    try {
      const result = await db.insert(users).values({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || null,
        userTypeId: userData.userTypeId,
      }).returning();
      
      // Convert null to undefined for phone
      const user = result[0];
      return {
        ...user,
        phone: user.phone === null ? undefined : user.phone,
        deletedAt: user.deletedAt === null ? undefined : user.deletedAt,
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update a user
   * @param id User ID
   * @param userData User data
   * @returns Updated user
   */
  async update(id: string, userData: UpdateUserDto): Promise<UserDto | null> {
    try {
      // Build update object with only provided fields
      const updateData: Partial<UpdateUserDto & { updatedAt: Date }> = {
        updatedAt: new Date(),
      };
      
      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.phone !== undefined) updateData.phone = userData.phone;
      if (userData.userTypeId !== undefined) updateData.userTypeId = userData.userTypeId;
      
      const result = await db.update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();
      
      if (result.length === 0) {
        return null;
      }
      
      // Convert null to undefined for phone
      const user = result[0];
      return {
        ...user,
        phone: user.phone === null ? undefined : user.phone,
        deletedAt: user.deletedAt === null ? undefined : user.deletedAt,
      };
    } catch (error) {
      logger.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a user's password
   * @param id User ID
   * @param password New password
   * @returns Updated user
   */
  async updatePassword(id: string, password: string): Promise<UserDto | null> {
    try {
      const result = await db.update(users)
        .set({ 
          password, 
          updatedAt: new Date() 
        })
        .where(eq(users.id, id))
        .returning();
      
      if (result.length === 0) {
        return null;
      }
      
      // Convert null to undefined for phone
      const user = result[0];
      return {
        ...user,
        phone: user.phone === null ? undefined : user.phone,
        deletedAt: user.deletedAt === null ? undefined : user.deletedAt,
      };
    } catch (error) {
      logger.error(`Error updating password for user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Soft delete a user
   * @param id User ID
   * @returns Deleted user
   */
  async softDelete(id: string): Promise<UserDto | null> {
    try {
      const now = new Date();
      
      const result = await db.update(users)
        .set({ 
          deleted: true, 
          deletedAt: now, 
          updatedAt: now 
        })
        .where(eq(users.id, id))
        .returning();
      
      if (result.length === 0) {
        return null;
      }
      
      // Convert null to undefined for phone
      const user = result[0];
      return {
        ...user,
        phone: user.phone === null ? undefined : user.phone,
        deletedAt: user.deletedAt === null ? undefined : user.deletedAt,
      };
    } catch (error) {
      logger.error(`Error soft deleting user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a user by ID
   * @param id User ID
   * @param includeDeleted Whether to include deleted users
   * @returns User or null if not found
   */
  async findById(id: string, includeDeleted: boolean = false): Promise<UserDto | null> {
    try {
      const conditions = [eq(users.id, id)];
      
      if (!includeDeleted) {
        conditions.push(eq(users.deleted, false));
      }
      
      const result = await db.select()
        .from(users)
        .where(and(...conditions))
        .limit(1);
      
      if (result.length === 0) {
        return null;
      }
      
      // Convert null to undefined for phone
      const user = result[0];
      return {
        ...user,
        phone: user.phone === null ? undefined : user.phone,
        deletedAt: user.deletedAt === null ? undefined : user.deletedAt,
      };
    } catch (error) {
      logger.error(`Error finding user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a user by email
   * @param email User email
   * @param includeDeleted Whether to include deleted users
   * @returns User or null if not found
   */
  async findByEmail(email: string, includeDeleted: boolean = false): Promise<UserDto | null> {
    try {
      const conditions = [eq(users.email, email)];
      
      if (!includeDeleted) {
        conditions.push(eq(users.deleted, false));
      }
      
      const result = await db.select()
        .from(users)
        .where(and(...conditions))
        .limit(1);
      
      if (result.length === 0) {
        return null;
      }
      
      // Convert null to undefined for phone
      const user = result[0];
      return {
        ...user,
        phone: user.phone === null ? undefined : user.phone,
        deletedAt: user.deletedAt === null ? undefined : user.deletedAt,
      };
    } catch (error) {
      logger.error(`Error finding user with email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Find a user by phone
   * @param phone User phone
   * @param includeDeleted Whether to include deleted users
   * @returns User or null if not found
   */
  async findByPhone(phone: string, includeDeleted: boolean = false): Promise<UserDto | null> {
    try {
      const conditions = [eq(users.phone, phone)];
      
      if (!includeDeleted) {
        conditions.push(eq(users.deleted, false));
      }
      
      const result = await db.select()
        .from(users)
        .where(and(...conditions))
        .limit(1);
      
      if (result.length === 0) {
        return null;
      }
      
      // Convert null to undefined for phone
      const user = result[0];
      return {
        ...user,
        phone: user.phone === null ? undefined : user.phone,
        deletedAt: user.deletedAt === null ? undefined : user.deletedAt,
      };
    } catch (error) {
      logger.error(`Error finding user with phone ${phone}:`, error);
      throw error;
    }
  }

  /**
   * Find a user by query parameters
   * @param queryParams Query parameters
   * @returns User or null if not found
   */
  async findByQuery(queryParams: UserQueryDto): Promise<UserDto | null> {
    try {
      const { id, email, phone, includeDeleted = false } = queryParams;
      
      // Build conditions
      const conditions = [];
      
      if (id) conditions.push(eq(users.id, id));
      if (email) conditions.push(eq(users.email, email));
      if (phone) conditions.push(eq(users.phone, phone));
      
      if (conditions.length === 0) {
        return null;
      }
      
      // Add deleted condition if needed
      if (!includeDeleted) {
        conditions.push(eq(users.deleted, false));
      }
      
      // First get the user
      const userResult = await db.select()
        .from(users)
        .where(or(...conditions))
        .limit(1);
      
      if (userResult.length === 0) {
        return null;
      }
      
      const user = userResult[0];
      
      // Then get the user type
      const userTypeResult = await db.select()
        .from(userTypes)
        .where(eq(userTypes.id, user.userTypeId))
        .limit(1);
      
      const userType = userTypeResult.length > 0 ? userTypeResult[0] : null;
      
      // Return the combined result
      return {
        ...user,
        phone: user.phone === null ? undefined : user.phone,
        deletedAt: user.deletedAt === null ? undefined : user.deletedAt,
        userType: userType ? {
          id: userType.id,
          name: userType.name,
        } : undefined,
      };
    } catch (error) {
      logger.error('Error finding user by query:', error);
      throw error;
    }
  }

  /**
   * Check if a user exists by email
   * @param email User email
   * @param excludeUserId User ID to exclude from the check
   * @returns True if the user exists, false otherwise
   */
  async existsByEmail(email: string, excludeUserId?: string): Promise<boolean> {
    try {
      const conditions = [
        eq(users.email, email),
        eq(users.deleted, false)
      ];
      
      if (excludeUserId) {
        conditions.push(ne(users.id, excludeUserId));
      }
      
      const result = await db.select({ id: users.id })
        .from(users)
        .where(and(...conditions))
        .limit(1);
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error checking if user with email ${email} exists:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const userRepository = new UserRepository();
