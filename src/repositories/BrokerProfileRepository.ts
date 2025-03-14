import { and, eq, ilike, sql, or, isNull, isNotNull } from 'drizzle-orm';
import { db } from '../db/client';
import { brokerProfiles, brokerRegions, brokerNeighborhoods, regions, neighborhoods } from '../db/schema';
import { 
  BrokerProfileDto,
  CreateBrokerProfileDto,
  UpdateBrokerProfileDto,
  BrokerProfileFilters,
  BrokerProfileQueryOptions,
  UpdateRegionsDto,
  UpdateNeighborhoodsDto
} from '../dtos/BrokerProfileDto';
import { RegionDto } from '../dtos/RegionDto';
import { NeighborhoodDto } from '../dtos/NeighborhoodDto';
import logger from '../utils/logger';

/**
 * Repository for broker profiles
 */
export class BrokerProfileRepository {
  /**
   * Create a new broker profile
   * @param data Broker profile data
   * @returns Created broker profile
   */
  async create(data: CreateBrokerProfileDto): Promise<BrokerProfileDto> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Insert the broker profile
        const brokerProfileResult = await tx.insert(brokerProfiles).values({
          type: data.type,
          creci: data.creci,
          creciType: data.creciType,
          classification: data.classification || 0,
        }).returning();
        
        const brokerProfile = brokerProfileResult[0];
        
        // If region IDs are provided, associate them with the broker profile
        if (data.regions && data.regions.length > 0) {
          const brokerRegionsToCreate = data.regions.map(regionId => ({
            brokerId: brokerProfile.id,
            regionId,
          }));
          
          await tx.insert(brokerRegions).values(brokerRegionsToCreate);
        }
        
        // If neighborhood IDs are provided, associate them with the broker profile
        if (data.neighborhoods && data.neighborhoods.length > 0) {
          const brokerNeighborhoodsToCreate = data.neighborhoods.map(neighborhoodId => ({
            brokerId: brokerProfile.id,
            neighborhoodId,
          }));
          
          await tx.insert(brokerNeighborhoods).values(brokerNeighborhoodsToCreate);
        }
        
        return brokerProfile;
      });
    } catch (error) {
      logger.error('Error creating broker profile:', error);
      throw error;
    }
  }

  /**
   * Find a broker profile by ID
   * @param id Broker profile ID
   * @param options Query options
   * @returns Broker profile or null if not found
   */
  async findById(id: string, options: BrokerProfileQueryOptions = {}): Promise<BrokerProfileDto | null> {
    try {
      const { includeRegions = false, includeNeighborhoods = false } = options;
      
      // First get the broker profile
      const brokerProfile = await db.select()
        .from(brokerProfiles)
        .where(eq(brokerProfiles.id, id))
        .limit(1)
        .then(res => res[0] || null);
      
      if (!brokerProfile) {
        return null;
      }
      
      const brokerProfileDto: BrokerProfileDto = {
        ...brokerProfile,
        regions: [],
        neighborhoods: []
      };
      
      // If regions should be included, get them
      if (includeRegions) {
        const regionsResult = await db.select({
          region: regions,
        })
          .from(brokerRegions)
          .innerJoin(regions, eq(brokerRegions.regionId, regions.id))
          .where(eq(brokerRegions.brokerId, id));
        
        const regionsList = regionsResult.map(row => row.region);
        
        brokerProfileDto.regions = regionsList || [];
      }
      
      // If neighborhoods should be included, get them
      if (includeNeighborhoods) {
        const neighborhoodsResult = await db.select({
          neighborhood: neighborhoods,
        })
          .from(brokerNeighborhoods)
          .innerJoin(neighborhoods, eq(brokerNeighborhoods.neighborhoodId, neighborhoods.id))
          .where(eq(brokerNeighborhoods.brokerId, id));
        
        const neighborhoodsList = neighborhoodsResult.map(row => row.neighborhood);
        
        brokerProfileDto.neighborhoods = neighborhoodsList || [];
      }
      
      return brokerProfileDto;
    } catch (error) {
      logger.error(`Error finding broker profile with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find broker profiles by filter criteria
   * @param filters Filter criteria
   * @returns Filtered broker profiles
   */
  async findAll(filters: BrokerProfileFilters): Promise<BrokerProfileDto[]> {
    try {
      const { 
        type, 
        creciType, 
        classification, 
        regionId, 
        neighborhoodId,
        page = 1, 
        limit = 10,
        includeRegions = false, 
        includeNeighborhoods = false,
        includeDeleted = false
      } = filters;
      
      // Build conditions
      const conditions = [];
      
      if (type) {
        conditions.push(eq(brokerProfiles.type, type));
      }
      
      if (creciType) {
        conditions.push(eq(brokerProfiles.creciType, creciType));
      }
      
      if (classification !== undefined) {
        conditions.push(eq(brokerProfiles.classification, classification));
      }
      
      // Handle deleted flag
      if (!includeDeleted) {
        conditions.push(eq(brokerProfiles.deleted, false));
      }
      
      // Calculate offset for pagination
      const offset = (page - 1) * limit;
      
      // Build and execute the query
      let brokerProfilesResult;
      
      if (conditions.length > 0) {
        brokerProfilesResult = await db.select()
          .from(brokerProfiles)
          .where(and(...conditions))
          .limit(limit)
          .offset(offset);
      } else {
        brokerProfilesResult = await db.select()
          .from(brokerProfiles)
          .limit(limit)
          .offset(offset);
      }
      
      // Convert to DTOs with optional properties
      let brokerProfileDtos: BrokerProfileDto[] = brokerProfilesResult.map(profile => ({
        ...profile,
        regions: [],
        neighborhoods: []
      }));
      
      // Filter by region if specified
      if (regionId) {
        const brokerIdsWithRegion = await db.select({ brokerId: brokerRegions.brokerId })
          .from(brokerRegions)
          .where(eq(brokerRegions.regionId, regionId));
        
        const brokerIds = new Set(brokerIdsWithRegion.map(row => row.brokerId));
        
        brokerProfileDtos = brokerProfileDtos.filter(profile => brokerIds.has(profile.id));
      }
      
      // Filter by neighborhood if specified
      if (neighborhoodId) {
        const brokerIdsWithNeighborhood = await db.select({ brokerId: brokerNeighborhoods.brokerId })
          .from(brokerNeighborhoods)
          .where(eq(brokerNeighborhoods.neighborhoodId, neighborhoodId));
        
        const brokerIds = new Set(brokerIdsWithNeighborhood.map(row => row.brokerId));
        
        brokerProfileDtos = brokerProfileDtos.filter(profile => brokerIds.has(profile.id));
      }
      
      // If no additional data is needed, return profiles as is
      if (!includeRegions && !includeNeighborhoods) {
        return brokerProfileDtos;
      }
      
      // Get all broker IDs
      const brokerIds = brokerProfileDtos.map(profile => profile.id);
      
      if (brokerIds.length === 0) {
        return [];
      }
      
      // Get regions if needed
      if (includeRegions) {
        const regionsResult = await db.select({
          brokerId: brokerRegions.brokerId,
          region: regions,
        })
          .from(brokerRegions)
          .innerJoin(regions, eq(brokerRegions.regionId, regions.id))
          .where(sql`${brokerRegions.brokerId} IN (${brokerIds.join(', ')})`);
        
        // Group regions by broker ID
        const regionsByBrokerId = new Map<string, RegionDto[]>();
        
        for (const row of regionsResult) {
          if (!regionsByBrokerId.has(row.brokerId)) {
            regionsByBrokerId.set(row.brokerId, []);
          }
          
          regionsByBrokerId.get(row.brokerId)!.push(row.region);
        }
        
        // Add regions to broker profiles
        for (const profile of brokerProfileDtos) {
          profile.regions = regionsByBrokerId.get(profile.id) || [];
        }
      }
      
      // Get neighborhoods if needed
      if (includeNeighborhoods) {
        const neighborhoodsResult = await db.select({
          brokerId: brokerNeighborhoods.brokerId,
          neighborhood: neighborhoods,
        })
          .from(brokerNeighborhoods)
          .innerJoin(neighborhoods, eq(brokerNeighborhoods.neighborhoodId, neighborhoods.id))
          .where(sql`${brokerNeighborhoods.brokerId} IN (${brokerIds.join(', ')})`);
        
        // Group neighborhoods by broker ID
        const neighborhoodsByBrokerId = new Map<string, NeighborhoodDto[]>();
        
        for (const row of neighborhoodsResult) {
          if (!neighborhoodsByBrokerId.has(row.brokerId)) {
            neighborhoodsByBrokerId.set(row.brokerId, []);
          }
          
          neighborhoodsByBrokerId.get(row.brokerId)!.push(row.neighborhood);
        }
        
        // Add neighborhoods to broker profiles
        for (const profile of brokerProfileDtos) {
          profile.neighborhoods = neighborhoodsByBrokerId.get(profile.id) || [];
        }
      }
      
      return brokerProfileDtos;
    } catch (error) {
      logger.error('Error finding broker profiles:', error);
      throw error;
    }
  }

  /**
   * Update a broker profile
   * @param id Broker profile ID
   * @param data Update data
   * @returns Updated broker profile
   */
  async update(id: string, data: UpdateBrokerProfileDto): Promise<BrokerProfileDto | null> {
    try {
      // Build update object with only provided fields
      const updateData: Partial<UpdateBrokerProfileDto & { updatedAt: Date }> = {
        updatedAt: new Date(),
      };
      
      if (data.type !== undefined) updateData.type = data.type;
      if (data.creci !== undefined) updateData.creci = data.creci;
      if (data.creciType !== undefined) updateData.creciType = data.creciType;
      if (data.classification !== undefined) updateData.classification = data.classification;
      
      const result = await db.update(brokerProfiles)
        .set(updateData)
        .where(and(
          eq(brokerProfiles.id, id),
          eq(brokerProfiles.deleted, false)
        ))
        .returning();
      
      if (result.length === 0) {
        return null;
      }
      
      return result[0];
    } catch (error) {
      logger.error(`Error updating broker profile with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Soft delete a broker profile
   * @param id Broker profile ID
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.update(brokerProfiles)
        .set({
          deleted: true,
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(and(
          eq(brokerProfiles.id, id),
          eq(brokerProfiles.deleted, false)
        ))
        .returning({ id: brokerProfiles.id });
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error soft deleting broker profile with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Restore a soft-deleted broker profile
   * @param id Broker profile ID
   * @returns True if restored, false if not found
   */
  async restore(id: string): Promise<boolean> {
    try {
      const result = await db.update(brokerProfiles)
        .set({
          deleted: false,
          deletedAt: null,
          updatedAt: new Date(),
        })
        .where(and(
          eq(brokerProfiles.id, id),
          eq(brokerProfiles.deleted, true)
        ))
        .returning({ id: brokerProfiles.id });
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error restoring broker profile with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update the regions associated with a broker profile
   * @param brokerId Broker profile ID
   * @param data Update data
   * @returns True if successful, false if broker profile not found
   */
  async updateRegions(brokerId: string, data: UpdateRegionsDto): Promise<boolean> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Check if broker profile exists and is not deleted
        const brokerExists = await tx.select({ id: brokerProfiles.id })
          .from(brokerProfiles)
          .where(and(
            eq(brokerProfiles.id, brokerId),
            eq(brokerProfiles.deleted, false)
          ))
          .limit(1);
        
        if (brokerExists.length === 0) {
          return false;
        }
        
        // Delete all existing associations
        await tx.delete(brokerRegions)
          .where(eq(brokerRegions.brokerId, brokerId));
        
        // Insert new associations
        if (data.regionIds.length > 0) {
          const brokerRegionsToCreate = data.regionIds.map(regionId => ({
            brokerId,
            regionId,
          }));
          
          await tx.insert(brokerRegions).values(brokerRegionsToCreate);
        }
        
        return true;
      });
    } catch (error) {
      logger.error(`Error updating regions for broker profile with ID ${brokerId}:`, error);
      throw error;
    }
  }

  /**
   * Add regions to a broker profile
   * @param brokerId Broker profile ID
   * @param data Regions to add
   * @returns True if successful, false if broker profile not found
   */
  async addRegions(brokerId: string, data: UpdateRegionsDto): Promise<boolean> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Check if broker profile exists and is not deleted
        const brokerExists = await tx.select({ id: brokerProfiles.id })
          .from(brokerProfiles)
          .where(and(
            eq(brokerProfiles.id, brokerId),
            eq(brokerProfiles.deleted, false)
          ))
          .limit(1);
        
        if (brokerExists.length === 0) {
          return false;
        }
        
        // Get existing region associations
        const existingAssociations = await tx.select({
          regionId: brokerRegions.regionId,
        })
          .from(brokerRegions)
          .where(eq(brokerRegions.brokerId, brokerId));
        
        const existingRegionIds = new Set(existingAssociations.map(a => a.regionId));
        
        // Filter out regions that are already associated
        const newRegionIds = data.regionIds.filter(id => !existingRegionIds.has(id));
        
        // Insert new associations
        if (newRegionIds.length > 0) {
          const brokerRegionsToCreate = newRegionIds.map(regionId => ({
            brokerId,
            regionId,
          }));
          
          await tx.insert(brokerRegions).values(brokerRegionsToCreate);
        }
        
        return true;
      });
    } catch (error) {
      logger.error(`Error adding regions to broker profile with ID ${brokerId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a region from a broker profile
   * @param brokerId Broker profile ID
   * @param regionId Region ID
   * @returns True if successful, false if association not found
   */
  async removeRegion(brokerId: string, regionId: string): Promise<boolean> {
    try {
      const result = await db.delete(brokerRegions)
        .where(
          and(
            eq(brokerRegions.brokerId, brokerId),
            eq(brokerRegions.regionId, regionId)
          )
        )
        .returning({ brokerId: brokerRegions.brokerId });
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error removing region ${regionId} from broker profile ${brokerId}:`, error);
      throw error;
    }
  }

  /**
   * Find regions associated with a broker profile
   * @param brokerId Broker profile ID
   * @returns Regions
   */
  async findRegions(brokerId: string): Promise<RegionDto[]> {
    try {
      const regionsResult = await db.select({
        region: regions,
      })
        .from(brokerRegions)
        .innerJoin(regions, eq(brokerRegions.regionId, regions.id))
        .where(eq(brokerRegions.brokerId, brokerId));
      
      return regionsResult.map(row => row.region);
    } catch (error) {
      logger.error(`Error finding regions for broker profile with ID ${brokerId}:`, error);
      throw error;
    }
  }

  /**
   * Update the neighborhoods associated with a broker profile
   * @param brokerId Broker profile ID
   * @param data Update data
   * @returns True if successful, false if broker profile not found
   */
  async updateNeighborhoods(brokerId: string, data: UpdateNeighborhoodsDto): Promise<boolean> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Check if broker profile exists and is not deleted
        const brokerExists = await tx.select({ id: brokerProfiles.id })
          .from(brokerProfiles)
          .where(and(
            eq(brokerProfiles.id, brokerId),
            eq(brokerProfiles.deleted, false)
          ))
          .limit(1);
        
        if (brokerExists.length === 0) {
          return false;
        }
        
        // Delete all existing associations
        await tx.delete(brokerNeighborhoods)
          .where(eq(brokerNeighborhoods.brokerId, brokerId));
        
        // Insert new associations
        if (data.neighborhoodIds.length > 0) {
          const brokerNeighborhoodsToCreate = data.neighborhoodIds.map(neighborhoodId => ({
            brokerId,
            neighborhoodId,
          }));
          
          await tx.insert(brokerNeighborhoods).values(brokerNeighborhoodsToCreate);
        }
        
        return true;
      });
    } catch (error) {
      logger.error(`Error updating neighborhoods for broker profile with ID ${brokerId}:`, error);
      throw error;
    }
  }

  /**
   * Add neighborhoods to a broker profile
   * @param brokerId Broker profile ID
   * @param data Neighborhoods to add
   * @returns True if successful, false if broker profile not found
   */
  async addNeighborhoods(brokerId: string, data: UpdateNeighborhoodsDto): Promise<boolean> {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Check if broker profile exists and is not deleted
        const brokerExists = await tx.select({ id: brokerProfiles.id })
          .from(brokerProfiles)
          .where(and(
            eq(brokerProfiles.id, brokerId),
            eq(brokerProfiles.deleted, false)
          ))
          .limit(1);
        
        if (brokerExists.length === 0) {
          return false;
        }
        
        // Get existing neighborhood associations
        const existingAssociations = await tx.select({
          neighborhoodId: brokerNeighborhoods.neighborhoodId,
        })
          .from(brokerNeighborhoods)
          .where(eq(brokerNeighborhoods.brokerId, brokerId));
        
        const existingNeighborhoodIds = new Set(existingAssociations.map(a => a.neighborhoodId));
        
        // Filter out neighborhoods that are already associated
        const newNeighborhoodIds = data.neighborhoodIds.filter(id => !existingNeighborhoodIds.has(id));
        
        // Insert new associations
        if (newNeighborhoodIds.length > 0) {
          const brokerNeighborhoodsToCreate = newNeighborhoodIds.map(neighborhoodId => ({
            brokerId,
            neighborhoodId,
          }));
          
          await tx.insert(brokerNeighborhoods).values(brokerNeighborhoodsToCreate);
        }
        
        return true;
      });
    } catch (error) {
      logger.error(`Error adding neighborhoods to broker profile with ID ${brokerId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a neighborhood from a broker profile
   * @param brokerId Broker profile ID
   * @param neighborhoodId Neighborhood ID
   * @returns True if successful, false if association not found
   */
  async removeNeighborhood(brokerId: string, neighborhoodId: string): Promise<boolean> {
    try {
      const result = await db.delete(brokerNeighborhoods)
        .where(
          and(
            eq(brokerNeighborhoods.brokerId, brokerId),
            eq(brokerNeighborhoods.neighborhoodId, neighborhoodId)
          )
        )
        .returning({ brokerId: brokerNeighborhoods.brokerId });
      
      return result.length > 0;
    } catch (error) {
      logger.error(`Error removing neighborhood ${neighborhoodId} from broker profile ${brokerId}:`, error);
      throw error;
    }
  }

  /**
   * Find neighborhoods associated with a broker profile
   * @param brokerId Broker profile ID
   * @returns Neighborhoods
   */
  async findNeighborhoods(brokerId: string): Promise<NeighborhoodDto[]> {
    try {
      const neighborhoodsResult = await db.select({
        neighborhood: neighborhoods,
      })
        .from(brokerNeighborhoods)
        .innerJoin(neighborhoods, eq(brokerNeighborhoods.neighborhoodId, neighborhoods.id))
        .where(eq(brokerNeighborhoods.brokerId, brokerId));
      
      return neighborhoodsResult.map(row => row.neighborhood);
    } catch (error) {
      logger.error(`Error finding neighborhoods for broker profile with ID ${brokerId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const brokerProfileRepository = new BrokerProfileRepository();
