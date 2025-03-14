import { brokerProfileRepository } from '../repositories/BrokerProfileRepository';
import { regionRepository } from '../repositories/RegionRepository';
import { neighborhoodRepository } from '../repositories/NeighborhoodRepository';
import { 
  BrokerProfileDto, 
  CreateBrokerProfileDto, 
  UpdateBrokerProfileDto, 
  BrokerProfileFilters,
  UpdateRegionsDto,
  UpdateNeighborhoodsDto
} from '../dtos/BrokerProfileDto';
import logger from '../utils/logger';

class BrokerProfileService {
  /**
   * Create a new broker profile
   * @param data Broker profile data
   * @returns Created broker profile
   */
  async create(data: CreateBrokerProfileDto): Promise<BrokerProfileDto> {
    logger.info(`BrokerProfileService: Creating broker profile with data: ${JSON.stringify(data)}`);
    
    try {
      // Validate regions if provided
      if (data.regions && data.regions.length > 0) {
        await this.validateRegions(data.regions);
      }
      
      // Validate neighborhoods if provided
      if (data.neighborhoods && data.neighborhoods.length > 0) {
        await this.validateNeighborhoods(data.neighborhoods);
      }
      
      // Create the broker profile
      const brokerProfile = await brokerProfileRepository.create(data);
      
      logger.info(`BrokerProfileService: Broker profile created with ID: ${brokerProfile.id}`);
      return brokerProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error creating broker profile: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find a broker profile by ID
   * @param id Broker profile ID
   * @param includeRegions Whether to include regions
   * @param includeNeighborhoods Whether to include neighborhoods
   * @returns Broker profile or null if not found
   */
  async findById(id: string, includeRegions: boolean = false, includeNeighborhoods: boolean = false): Promise<BrokerProfileDto | null> {
    logger.info(`BrokerProfileService: Finding broker profile with ID: ${id}, includeRegions: ${includeRegions}, includeNeighborhoods: ${includeNeighborhoods}`);
    
    try {
      const brokerProfile = await brokerProfileRepository.findById(id, {
        includeRegions,
        includeNeighborhoods,
      });
      
      if (!brokerProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return null;
      }
      
      logger.info(`BrokerProfileService: Broker profile found with ID: ${id}`);
      return brokerProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error finding broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find broker profiles by filter criteria
   * @param filters Filter criteria
   * @returns Filtered broker profiles
   */
  async findAll(filters: BrokerProfileFilters): Promise<BrokerProfileDto[]> {
    logger.info(`BrokerProfileService: Finding broker profiles with filters: ${JSON.stringify(filters)}`);
    
    try {
      const brokerProfiles = await brokerProfileRepository.findAll(filters);
      
      logger.info(`BrokerProfileService: Found ${brokerProfiles.length} broker profiles`);
      return brokerProfiles;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error finding broker profiles: ${error.message}`);
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
    logger.info(`BrokerProfileService: Updating broker profile with ID: ${id}, data: ${JSON.stringify(data)}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return null;
      }
      
      if (existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Cannot update deleted broker profile with ID: ${id}`);
        throw new Error('Cannot update a deleted broker profile');
      }
      
      // Update the broker profile
      const updatedProfile = await brokerProfileRepository.update(id, data);
      
      logger.info(`BrokerProfileService: Broker profile updated with ID: ${id}`);
      return updatedProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error updating broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Soft delete a broker profile
   * @param id Broker profile ID
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    logger.info(`BrokerProfileService: Deleting broker profile with ID: ${id}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return false;
      }
      
      if (existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Broker profile with ID: ${id} is already deleted`);
        return false;
      }
      
      // Delete the broker profile
      const deleted = await brokerProfileRepository.delete(id);
      
      logger.info(`BrokerProfileService: Broker profile deleted with ID: ${id}`);
      return deleted;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error deleting broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Restore a soft-deleted broker profile
   * @param id Broker profile ID
   * @returns True if restored, false if not found
   */
  async restore(id: string): Promise<boolean> {
    logger.info(`BrokerProfileService: Restoring broker profile with ID: ${id}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return false;
      }
      
      if (!existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Broker profile with ID: ${id} is not deleted`);
        return false;
      }
      
      // Restore the broker profile
      const restored = await brokerProfileRepository.restore(id);
      
      logger.info(`BrokerProfileService: Broker profile restored with ID: ${id}`);
      return restored;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error restoring broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update the regions associated with a broker profile
   * @param id Broker profile ID
   * @param data Update data
   * @returns True if successful, false if broker profile not found
   */
  async updateRegions(id: string, data: UpdateRegionsDto): Promise<boolean> {
    logger.info(`BrokerProfileService: Updating regions for broker profile with ID: ${id}, data: ${JSON.stringify(data)}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return false;
      }
      
      if (existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Cannot update regions for deleted broker profile with ID: ${id}`);
        throw new Error('Cannot update regions for a deleted broker profile');
      }
      
      // Validate regions
      await this.validateRegions(data.regionIds);
      
      // Update the regions
      const updated = await brokerProfileRepository.updateRegions(id, data);
      
      logger.info(`BrokerProfileService: Regions updated for broker profile with ID: ${id}`);
      return updated;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error updating regions for broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add regions to a broker profile
   * @param id Broker profile ID
   * @param data Regions to add
   * @returns True if successful, false if broker profile not found
   */
  async addRegions(id: string, data: UpdateRegionsDto): Promise<boolean> {
    logger.info(`BrokerProfileService: Adding regions to broker profile with ID: ${id}, data: ${JSON.stringify(data)}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return false;
      }
      
      if (existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Cannot add regions to deleted broker profile with ID: ${id}`);
        throw new Error('Cannot add regions to a deleted broker profile');
      }
      
      // Validate regions
      await this.validateRegions(data.regionIds);
      
      // Add the regions
      const added = await brokerProfileRepository.addRegions(id, data);
      
      logger.info(`BrokerProfileService: Regions added to broker profile with ID: ${id}`);
      return added;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error adding regions to broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove a region from a broker profile
   * @param id Broker profile ID
   * @param regionId Region ID
   * @returns True if successful, false if association not found
   */
  async removeRegion(id: string, regionId: string): Promise<boolean> {
    logger.info(`BrokerProfileService: Removing region ${regionId} from broker profile with ID: ${id}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return false;
      }
      
      if (existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Cannot remove region from deleted broker profile with ID: ${id}`);
        throw new Error('Cannot remove region from a deleted broker profile');
      }
      
      // Remove the region
      const removed = await brokerProfileRepository.removeRegion(id, regionId);
      
      logger.info(`BrokerProfileService: Region ${regionId} removed from broker profile with ID: ${id}`);
      return removed;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error removing region ${regionId} from broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find regions associated with a broker profile
   * @param id Broker profile ID
   * @returns Regions
   */
  async findRegions(id: string): Promise<BrokerProfileDto | null> {
    logger.info(`BrokerProfileService: Finding regions for broker profile with ID: ${id}`);
    
    try {
      const brokerProfile = await brokerProfileRepository.findById(id, { includeRegions: true });
      
      if (!brokerProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return null;
      }
      
      logger.info(`BrokerProfileService: Found ${brokerProfile.regions?.length || 0} regions for broker profile with ID: ${id}`);
      return brokerProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error finding regions for broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update the neighborhoods associated with a broker profile
   * @param id Broker profile ID
   * @param data Update data
   * @returns True if successful, false if broker profile not found
   */
  async updateNeighborhoods(id: string, data: UpdateNeighborhoodsDto): Promise<boolean> {
    logger.info(`BrokerProfileService: Updating neighborhoods for broker profile with ID: ${id}, data: ${JSON.stringify(data)}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return false;
      }
      
      if (existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Cannot update neighborhoods for deleted broker profile with ID: ${id}`);
        throw new Error('Cannot update neighborhoods for a deleted broker profile');
      }
      
      // Validate neighborhoods
      await this.validateNeighborhoods(data.neighborhoodIds);
      
      // Update the neighborhoods
      const updated = await brokerProfileRepository.updateNeighborhoods(id, data);
      
      logger.info(`BrokerProfileService: Neighborhoods updated for broker profile with ID: ${id}`);
      return updated;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error updating neighborhoods for broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add neighborhoods to a broker profile
   * @param id Broker profile ID
   * @param data Neighborhoods to add
   * @returns True if successful, false if broker profile not found
   */
  async addNeighborhoods(id: string, data: UpdateNeighborhoodsDto): Promise<boolean> {
    logger.info(`BrokerProfileService: Adding neighborhoods to broker profile with ID: ${id}, data: ${JSON.stringify(data)}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return false;
      }
      
      if (existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Cannot add neighborhoods to deleted broker profile with ID: ${id}`);
        throw new Error('Cannot add neighborhoods to a deleted broker profile');
      }
      
      // Validate neighborhoods
      await this.validateNeighborhoods(data.neighborhoodIds);
      
      // Add the neighborhoods
      const added = await brokerProfileRepository.addNeighborhoods(id, data);
      
      logger.info(`BrokerProfileService: Neighborhoods added to broker profile with ID: ${id}`);
      return added;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error adding neighborhoods to broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove a neighborhood from a broker profile
   * @param id Broker profile ID
   * @param neighborhoodId Neighborhood ID
   * @returns True if successful, false if association not found
   */
  async removeNeighborhood(id: string, neighborhoodId: string): Promise<boolean> {
    logger.info(`BrokerProfileService: Removing neighborhood ${neighborhoodId} from broker profile with ID: ${id}`);
    
    try {
      // Check if broker profile exists
      const existingProfile = await brokerProfileRepository.findById(id);
      
      if (!existingProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return false;
      }
      
      if (existingProfile.deleted) {
        logger.warn(`BrokerProfileService: Cannot remove neighborhood from deleted broker profile with ID: ${id}`);
        throw new Error('Cannot remove neighborhood from a deleted broker profile');
      }
      
      // Remove the neighborhood
      const removed = await brokerProfileRepository.removeNeighborhood(id, neighborhoodId);
      
      logger.info(`BrokerProfileService: Neighborhood ${neighborhoodId} removed from broker profile with ID: ${id}`);
      return removed;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error removing neighborhood ${neighborhoodId} from broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find neighborhoods associated with a broker profile
   * @param id Broker profile ID
   * @returns Neighborhoods
   */
  async findNeighborhoods(id: string): Promise<BrokerProfileDto | null> {
    logger.info(`BrokerProfileService: Finding neighborhoods for broker profile with ID: ${id}`);
    
    try {
      const brokerProfile = await brokerProfileRepository.findById(id, { includeNeighborhoods: true });
      
      if (!brokerProfile) {
        logger.warn(`BrokerProfileService: Broker profile not found with ID: ${id}`);
        return null;
      }
      
      logger.info(`BrokerProfileService: Found ${brokerProfile.neighborhoods?.length || 0} neighborhoods for broker profile with ID: ${id}`);
      return brokerProfile;
    } catch (error: any) {
      logger.error(`BrokerProfileService: Error finding neighborhoods for broker profile with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate region IDs
   * @param regionIds Region IDs to validate
   * @throws Error if any region ID is invalid
   */
  private async validateRegions(regionIds: string[]): Promise<void> {
    for (const regionId of regionIds) {
      const region = await regionRepository.findById(regionId);
      
      if (!region) {
        logger.warn(`BrokerProfileService: Region not found with ID: ${regionId}`);
        throw new Error(`Region not found with ID: ${regionId}`);
      }
    }
  }

  /**
   * Validate neighborhood IDs
   * @param neighborhoodIds Neighborhood IDs to validate
   * @throws Error if any neighborhood ID is invalid
   */
  private async validateNeighborhoods(neighborhoodIds: string[]): Promise<void> {
    for (const neighborhoodId of neighborhoodIds) {
      const neighborhood = await neighborhoodRepository.findById(neighborhoodId);
      
      if (!neighborhood) {
        logger.warn(`BrokerProfileService: Neighborhood not found with ID: ${neighborhoodId}`);
        throw new Error(`Neighborhood not found with ID: ${neighborhoodId}`);
      }
    }
  }
}

// Export a singleton instance
export const brokerProfileService = new BrokerProfileService();
