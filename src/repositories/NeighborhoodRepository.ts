import { and, eq, ilike, ne, or } from 'drizzle-orm';
import { db } from '../db/client';
import { neighborhoods, regionNeighborhoods } from '../db/schema';
import { 
  CreateNeighborhoodDto, 
  CreateBatchNeighborhoodDto,
  UpdateNeighborhoodDto, 
  NeighborhoodFilters, 
  NeighborhoodDto,
  NeighborhoodUsageDto
} from '../dtos/NeighborhoodDto';
import logger from '../utils/logger';

/**
 * Repository for neighborhoods
 */
export class NeighborhoodRepository {
  /**
   * Create a new neighborhood
   * @param data Neighborhood data
   * @returns Created neighborhood
   */
  async create(data: CreateNeighborhoodDto): Promise<NeighborhoodDto> {
    try {
      const result = await db.insert(neighborhoods).values({
        name: data.name,
        city: data.city,
      }).returning();
      
      return result[0];
    } catch (error) {
      logger.error('Error creating neighborhood:', error);
      throw error;
    }
  }

  /**
   * Create multiple neighborhoods in batch
   * @param data Batch creation data
   * @returns Created neighborhoods
   */
  async createMany(data: CreateBatchNeighborhoodDto): Promise<NeighborhoodDto[]> {
    try {
      // Map neighborhood names to objects with city
      const neighborhoodsToCreate = data.neighborhoods.map(name => ({
        name,
        city: data.city,
      }));
      
      // Insert all neighborhoods
      const result = await db.insert(neighborhoods)
        .values(neighborhoodsToCreate)
        .returning();
      
      return result;
    } catch (error) {
      logger.error('Error creating neighborhoods in batch:', error);
      throw error;
    }
  }

  /**
   * Find a neighborhood by ID
   * @param id Neighborhood ID
   * @returns Neighborhood or null if not found
   */
  async findById(id: string): Promise<NeighborhoodDto | null> {
    try {
      const result = await db.select()
        .from(neighborhoods)
        .where(eq(neighborhoods.id, id))
        .limit(1);
      
      if (result.length === 0) {
        return null;
      }
      
      return result[0];
    } catch (error) {
      logger.error(`Error finding neighborhood with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find neighborhoods by filter criteria
   * @param filters Filter criteria
   * @returns Filtered neighborhoods
   */
  async findAll(filters: NeighborhoodFilters): Promise<NeighborhoodDto[]> {
    try {
      const { name, city } = filters;
      
      // Build conditions
      const conditions = [];
      
      if (name) {
        conditions.push(ilike(neighborhoods.name, `%${name}%`));
      }
      
      if (city) {
        conditions.push(eq(neighborhoods.city, city));
      }
      
      // Execute query
      let result;
      
      if (conditions.length > 0) {
        result = await db.select()
          .from(neighborhoods)
          .where(and(...conditions));
      } else {
        result = await db.select()
          .from(neighborhoods);
      }
      
      return result;
    } catch (error) {
      logger.error('Error finding neighborhoods:', error);
      throw error;
    }
  }

  /**
   * Update a neighborhood
   * @param id Neighborhood ID
   * @param data Update data
   * @returns Updated neighborhood
   */
  async update(id: string, data: UpdateNeighborhoodDto): Promise<NeighborhoodDto | null> {
    try {
      // Build update object with only provided fields
      const updateData: Partial<UpdateNeighborhoodDto & { updatedAt: Date }> = {
        updatedAt: new Date(),
      };
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.city !== undefined) updateData.city = data.city;
      
      const result = await db.update(neighborhoods)
        .set(updateData)
        .where(eq(neighborhoods.id, id))
        .returning();
      
      if (result.length === 0) {
        return null;
      }
      
      return result[0];
    } catch (error) {
      logger.error(`Error updating neighborhood with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a neighborhood
   * @param id Neighborhood ID
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.delete(neighborhoods)
        .where(eq(neighborhoods.id, id))
        .returning({ id: neighborhoods.id });
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error deleting neighborhood with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if a neighborhood exists by name and city
   * @param name Neighborhood name
   * @param city City
   * @param excludeId Neighborhood ID to exclude
   * @returns True if exists, false otherwise
   */
  async existsByNameAndCity(name: string, city: string, excludeId?: string): Promise<boolean> {
    try {
      const conditions = [
        eq(neighborhoods.name, name),
        eq(neighborhoods.city, city)
      ];
      
      if (excludeId) {
        conditions.push(ne(neighborhoods.id, excludeId));
      }
      
      const result = await db.select({ id: neighborhoods.id })
        .from(neighborhoods)
        .where(and(...conditions))
        .limit(1);
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error checking if neighborhood ${name} in ${city} exists:`, error);
      throw error;
    }
  }

  /**
   * Check if a neighborhood is being used
   * @param id Neighborhood ID
   * @returns Usage information
   */
  async checkUsage(id: string): Promise<NeighborhoodUsageDto> {
    try {
      // Check if the neighborhood is used in any regions
      const regionResult = await db.select({ regionId: regionNeighborhoods.regionId })
        .from(regionNeighborhoods)
        .where(eq(regionNeighborhoods.neighborhoodId, id));
      
      const isUsed = regionResult.length > 0;
      const usedIn = isUsed ? ['regions'] : [];
      
      return {
        isUsed,
        usedIn
      };
    } catch (error) {
      logger.error(`Error checking usage of neighborhood with ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const neighborhoodRepository = new NeighborhoodRepository();
