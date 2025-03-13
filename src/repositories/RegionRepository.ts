import { and, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { neighborhoods, regions, regionNeighborhoods } from '../db/schema';
import { 
  CreateRegionDto, 
  UpdateRegionDto, 
  RegionFilters, 
  RegionDto,
  RegionUsageDto,
  UpdateRegionNeighborhoodsDto,
  AddNeighborhoodsDto
} from '../dtos/RegionDto';
import { NeighborhoodDto } from '../dtos/NeighborhoodDto';
import logger from '../utils/logger';

/**
 * Repository for regions
 */
export class RegionRepository {
  /**
   * Create a new region
   * @param data Region data
   * @returns Created region
   */
  async create(data: CreateRegionDto): Promise<RegionDto> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Insert the region
        const regionResult = await tx.insert(regions).values({
          name: data.name,
        }).returning();
        
        const region = regionResult[0];
        
        // If neighborhood IDs are provided, associate them with the region
        if (data.neighborhood_ids && data.neighborhood_ids.length > 0) {
          const regionNeighborhoodsToCreate = data.neighborhood_ids.map(neighborhoodId => ({
            regionId: region.id,
            neighborhoodId,
          }));
          
          await tx.insert(regionNeighborhoods).values(regionNeighborhoodsToCreate);
        }
        
        return region;
      });
    } catch (error) {
      logger.error('Error creating region:', error);
      throw error;
    }
  }

  /**
   * Find a region by ID
   * @param id Region ID
   * @param includeNeighborhoods Whether to include neighborhoods in the result
   * @returns Region or null if not found
   */
  async findById(id: string, includeNeighborhoods: boolean = false): Promise<RegionDto | null> {
    try {
      // First get the region
      const regionResult = await db.select()
        .from(regions)
        .where(eq(regions.id, id))
        .limit(1);
      
      if (regionResult.length === 0) {
        return null;
      }
      
      const region = regionResult[0];
      
      // If neighborhoods should be included, get them
      if (includeNeighborhoods) {
        const neighborhoodsResult = await db.select({
          neighborhood: neighborhoods,
        })
          .from(regionNeighborhoods)
          .innerJoin(neighborhoods, eq(regionNeighborhoods.neighborhoodId, neighborhoods.id))
          .where(eq(regionNeighborhoods.regionId, id));
        
        const neighborhoodsList = neighborhoodsResult.map(row => row.neighborhood);
        
        return {
          ...region,
          neighborhoods: neighborhoodsList,
        };
      }
      
      return region;
    } catch (error) {
      logger.error(`Error finding region with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find regions by filter criteria
   * @param filters Filter criteria
   * @returns Filtered regions
   */
  async findAll(filters: RegionFilters): Promise<RegionDto[]> {
    try {
      const { name, include_neighborhoods = false } = filters;
      
      // Build conditions
      const conditions = [];
      
      if (name) {
        conditions.push(ilike(regions.name, `%${name}%`));
      }
      
      // Get regions
      let regionsResult;
      
      if (conditions.length > 0) {
        regionsResult = await db.select()
          .from(regions)
          .where(and(...conditions));
      } else {
        regionsResult = await db.select()
          .from(regions);
      }
      
      // If neighborhoods should not be included, return regions as is
      if (!include_neighborhoods) {
        return regionsResult;
      }
      
      // Get all region IDs
      const regionIds = regionsResult.map(region => region.id);
      
      if (regionIds.length === 0) {
        return [];
      }
      
      // Get all neighborhoods for these regions
      const neighborhoodsResult = await db.select({
        regionId: regionNeighborhoods.regionId,
        neighborhood: neighborhoods,
      })
        .from(regionNeighborhoods)
        .innerJoin(neighborhoods, eq(regionNeighborhoods.neighborhoodId, neighborhoods.id))
        .where(sql`${regionNeighborhoods.regionId} IN (${regionIds.join(', ')})`);
      
      // Group neighborhoods by region ID
      const neighborhoodsByRegionId = new Map<string, NeighborhoodDto[]>();
      
      for (const row of neighborhoodsResult) {
        if (!neighborhoodsByRegionId.has(row.regionId)) {
          neighborhoodsByRegionId.set(row.regionId, []);
        }
        
        neighborhoodsByRegionId.get(row.regionId)!.push(row.neighborhood);
      }
      
      // Add neighborhoods to regions
      return regionsResult.map(region => ({
        ...region,
        neighborhoods: neighborhoodsByRegionId.get(region.id) || [],
      }));
    } catch (error) {
      logger.error('Error finding regions:', error);
      throw error;
    }
  }

  /**
   * Update a region
   * @param id Region ID
   * @param data Update data
   * @returns Updated region
   */
  async update(id: string, data: UpdateRegionDto): Promise<RegionDto | null> {
    try {
      // Build update object with only provided fields
      const updateData: Partial<UpdateRegionDto & { updatedAt: Date }> = {
        updatedAt: new Date(),
      };
      
      if (data.name !== undefined) updateData.name = data.name;
      
      const result = await db.update(regions)
        .set(updateData)
        .where(eq(regions.id, id))
        .returning();
      
      if (result.length === 0) {
        return null;
      }
      
      return result[0];
    } catch (error) {
      logger.error(`Error updating region with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update the neighborhoods associated with a region
   * @param id Region ID
   * @param data Update data
   * @returns True if successful, false if region not found
   */
  async updateNeighborhoods(id: string, data: UpdateRegionNeighborhoodsDto): Promise<boolean> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Check if region exists
        const regionExists = await tx.select({ id: regions.id })
          .from(regions)
          .where(eq(regions.id, id))
          .limit(1);
        
        if (regionExists.length === 0) {
          return false;
        }
        
        // Delete all existing associations
        await tx.delete(regionNeighborhoods)
          .where(eq(regionNeighborhoods.regionId, id));
        
        // Insert new associations
        if (data.neighborhood_ids.length > 0) {
          const regionNeighborhoodsToCreate = data.neighborhood_ids.map(neighborhoodId => ({
            regionId: id,
            neighborhoodId,
          }));
          
          await tx.insert(regionNeighborhoods).values(regionNeighborhoodsToCreate);
        }
        
        return true;
      });
    } catch (error) {
      logger.error(`Error updating neighborhoods for region with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add neighborhoods to a region
   * @param id Region ID
   * @param data Neighborhoods to add
   * @returns True if successful, false if region not found
   */
  async addNeighborhoods(id: string, data: AddNeighborhoodsDto): Promise<boolean> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Check if region exists
        const regionExists = await tx.select({ id: regions.id })
          .from(regions)
          .where(eq(regions.id, id))
          .limit(1);
        
        if (regionExists.length === 0) {
          return false;
        }
        
        // Get existing neighborhood associations
        const existingAssociations = await tx.select({
          neighborhoodId: regionNeighborhoods.neighborhoodId,
        })
          .from(regionNeighborhoods)
          .where(eq(regionNeighborhoods.regionId, id));
        
        const existingNeighborhoodIds = new Set(existingAssociations.map(a => a.neighborhoodId));
        
        // Filter out neighborhoods that are already associated
        const newNeighborhoodIds = data.neighborhood_ids.filter(id => !existingNeighborhoodIds.has(id));
        
        // Insert new associations
        if (newNeighborhoodIds.length > 0) {
          const regionNeighborhoodsToCreate = newNeighborhoodIds.map(neighborhoodId => ({
            regionId: id,
            neighborhoodId,
          }));
          
          await tx.insert(regionNeighborhoods).values(regionNeighborhoodsToCreate);
        }
        
        return true;
      });
    } catch (error) {
      logger.error(`Error adding neighborhoods to region with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Remove a neighborhood from a region
   * @param regionId Region ID
   * @param neighborhoodId Neighborhood ID
   * @returns True if successful, false if association not found
   */
  async removeNeighborhood(regionId: string, neighborhoodId: string): Promise<boolean> {
    try {
      const result = await db.delete(regionNeighborhoods)
        .where(
          and(
            eq(regionNeighborhoods.regionId, regionId),
            eq(regionNeighborhoods.neighborhoodId, neighborhoodId)
          )
        )
        .returning({ regionId: regionNeighborhoods.regionId });
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error removing neighborhood ${neighborhoodId} from region ${regionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a region
   * @param id Region ID
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    try {
      // The foreign key constraint with ON DELETE CASCADE will automatically
      // delete the associations in the region_neighborhoods table
      const result = await db.delete(regions)
        .where(eq(regions.id, id))
        .returning({ id: regions.id });
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error deleting region with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if a region exists by name
   * @param name Region name
   * @param excludeId Region ID to exclude
   * @returns True if exists, false otherwise
   */
  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    try {
      const conditions = [eq(regions.name, name)];
      
      if (excludeId) {
        conditions.push(sql`${regions.id} != ${excludeId}`);
      }
      
      const result = await db.select({ id: regions.id })
        .from(regions)
        .where(and(...conditions))
        .limit(1);
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error checking if region ${name} exists:`, error);
      throw error;
    }
  }

  /**
   * Check if a region is being used
   * @param id Region ID
   * @returns Usage information
   */
  async checkUsage(id: string): Promise<RegionUsageDto> {
    try {
      // In a real application, you would check if the region is used in other modules
      // For now, we'll just return that it's not used
      return {
        isUsed: false,
        usedIn: []
      };
    } catch (error) {
      logger.error(`Error checking usage of region with ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const regionRepository = new RegionRepository();
