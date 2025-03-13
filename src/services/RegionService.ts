import { AppError } from '../middlewares/ErrorHandlerMiddleware';
import { regionRepository } from '../repositories/RegionRepository';
import { neighborhoodRepository } from '../repositories/NeighborhoodRepository';
import { 
  CreateRegionDto, 
  UpdateRegionDto, 
  RegionFilters, 
  RegionDto,
  RegionUsageDto,
  UpdateRegionNeighborhoodsDto,
  AddNeighborhoodsDto
} from '../dtos/RegionDto';
import logger from '../utils/logger';

/**
 * Service for regions
 */
export class RegionService {
  /**
   * Create a new region
   * @param data Region data
   * @returns Created region
   */
  async create(data: CreateRegionDto): Promise<RegionDto> {
    try {
      logger.info(`Creating region ${data.name}`);
      
      // Check if region already exists
      const exists = await regionRepository.existsByName(data.name);
      if (exists) {
        throw new AppError(`Region ${data.name} already exists`, 409, 'CONFLICT');
      }
      
      // Validate neighborhood IDs if provided
      if (data.neighborhood_ids && data.neighborhood_ids.length > 0) {
        for (const neighborhoodId of data.neighborhood_ids) {
          const neighborhood = await neighborhoodRepository.findById(neighborhoodId);
          if (!neighborhood) {
            throw new AppError(`Neighborhood with ID ${neighborhoodId} not found`, 404, 'NOT_FOUND');
          }
        }
      }
      
      // Create region
      const region = await regionRepository.create(data);
      
      // Return region with neighborhoods if they were provided
      if (data.neighborhood_ids && data.neighborhood_ids.length > 0) {
        const regionWithNeighborhoods = await regionRepository.findById(region.id, true);
        if (!regionWithNeighborhoods) {
          throw new AppError(`Failed to retrieve created region with ID ${region.id}`, 500, 'INTERNAL_SERVER_ERROR');
        }
        return regionWithNeighborhoods;
      }
      
      return region;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error in RegionService.create:', error);
      throw new AppError('Failed to create region', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Find a region by ID
   * @param id Region ID
   * @param includeNeighborhoods Whether to include neighborhoods in the result
   * @returns Region
   */
  async findById(id: string, includeNeighborhoods: boolean = false): Promise<RegionDto> {
    try {
      logger.info(`Finding region with ID ${id}`);
      
      const region = await regionRepository.findById(id, includeNeighborhoods);
      
      if (!region) {
        throw new AppError(`Region with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      return region;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in RegionService.findById(${id}):`, error);
      throw new AppError('Failed to find region', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Find regions by filter criteria
   * @param filters Filter criteria
   * @returns Filtered regions
   */
  async findAll(filters: RegionFilters): Promise<RegionDto[]> {
    try {
      logger.info(`Finding regions with filters: ${JSON.stringify(filters)}`);
      
      return await regionRepository.findAll(filters);
    } catch (error) {
      logger.error('Error in RegionService.findAll:', error);
      throw new AppError('Failed to find regions', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Update a region
   * @param id Region ID
   * @param data Update data
   * @returns Updated region
   */
  async update(id: string, data: UpdateRegionDto): Promise<RegionDto> {
    try {
      logger.info(`Updating region with ID ${id}`);
      
      // Check if region exists
      const region = await regionRepository.findById(id);
      if (!region) {
        throw new AppError(`Region with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      // Check if the updated name would create a duplicate
      if (data.name !== undefined) {
        const exists = await regionRepository.existsByName(data.name, id);
        if (exists) {
          throw new AppError(`Region ${data.name} already exists`, 409, 'CONFLICT');
        }
      }
      
      // Update region
      const updatedRegion = await regionRepository.update(id, data);
      
      if (!updatedRegion) {
        throw new AppError(`Failed to update region with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
      
      return updatedRegion;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in RegionService.update(${id}):`, error);
      throw new AppError('Failed to update region', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Update the neighborhoods associated with a region
   * @param id Region ID
   * @param data Update data
   */
  async updateNeighborhoods(id: string, data: UpdateRegionNeighborhoodsDto): Promise<void> {
    try {
      logger.info(`Updating neighborhoods for region with ID ${id}`);
      
      // Check if region exists
      const region = await regionRepository.findById(id);
      if (!region) {
        throw new AppError(`Region with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      // Validate neighborhood IDs
      for (const neighborhoodId of data.neighborhood_ids) {
        const neighborhood = await neighborhoodRepository.findById(neighborhoodId);
        if (!neighborhood) {
          throw new AppError(`Neighborhood with ID ${neighborhoodId} not found`, 404, 'NOT_FOUND');
        }
      }
      
      // Update neighborhoods
      const success = await regionRepository.updateNeighborhoods(id, data);
      
      if (!success) {
        throw new AppError(`Failed to update neighborhoods for region with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in RegionService.updateNeighborhoods(${id}):`, error);
      throw new AppError('Failed to update region neighborhoods', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Add neighborhoods to a region
   * @param id Region ID
   * @param data Neighborhoods to add
   */
  async addNeighborhoods(id: string, data: AddNeighborhoodsDto): Promise<void> {
    try {
      logger.info(`Adding neighborhoods to region with ID ${id}`);
      
      // Check if region exists
      const region = await regionRepository.findById(id);
      if (!region) {
        throw new AppError(`Region with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      // Validate neighborhood IDs
      for (const neighborhoodId of data.neighborhood_ids) {
        const neighborhood = await neighborhoodRepository.findById(neighborhoodId);
        if (!neighborhood) {
          throw new AppError(`Neighborhood with ID ${neighborhoodId} not found`, 404, 'NOT_FOUND');
        }
      }
      
      // Add neighborhoods
      const success = await regionRepository.addNeighborhoods(id, data);
      
      if (!success) {
        throw new AppError(`Failed to add neighborhoods to region with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in RegionService.addNeighborhoods(${id}):`, error);
      throw new AppError('Failed to add neighborhoods to region', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Remove a neighborhood from a region
   * @param regionId Region ID
   * @param neighborhoodId Neighborhood ID
   */
  async removeNeighborhood(regionId: string, neighborhoodId: string): Promise<void> {
    try {
      logger.info(`Removing neighborhood ${neighborhoodId} from region ${regionId}`);
      
      // Check if region exists
      const region = await regionRepository.findById(regionId);
      if (!region) {
        throw new AppError(`Region with ID ${regionId} not found`, 404, 'NOT_FOUND');
      }
      
      // Check if neighborhood exists
      const neighborhood = await neighborhoodRepository.findById(neighborhoodId);
      if (!neighborhood) {
        throw new AppError(`Neighborhood with ID ${neighborhoodId} not found`, 404, 'NOT_FOUND');
      }
      
      // Remove neighborhood
      const success = await regionRepository.removeNeighborhood(regionId, neighborhoodId);
      
      if (!success) {
        throw new AppError(
          `Failed to remove neighborhood ${neighborhoodId} from region ${regionId}`,
          500,
          'INTERNAL_SERVER_ERROR'
        );
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in RegionService.removeNeighborhood(${regionId}, ${neighborhoodId}):`, error);
      throw new AppError('Failed to remove neighborhood from region', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Delete a region
   * @param id Region ID
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info(`Deleting region with ID ${id}`);
      
      // Check if region exists
      const region = await regionRepository.findById(id);
      if (!region) {
        throw new AppError(`Region with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      // Check if region is being used
      const usage = await regionRepository.checkUsage(id);
      if (usage.isUsed) {
        throw new AppError(
          `Cannot delete region with ID ${id} because it is being used in: ${usage.usedIn.join(', ')}`,
          403,
          'FORBIDDEN'
        );
      }
      
      // Delete region
      const deleted = await regionRepository.delete(id);
      
      if (!deleted) {
        throw new AppError(`Failed to delete region with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in RegionService.delete(${id}):`, error);
      throw new AppError('Failed to delete region', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Check if a region is being used
   * @param id Region ID
   * @returns Usage information
   */
  async checkUsage(id: string): Promise<RegionUsageDto> {
    try {
      logger.info(`Checking usage of region with ID ${id}`);
      
      // Check if region exists
      const region = await regionRepository.findById(id);
      if (!region) {
        throw new AppError(`Region with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      return await regionRepository.checkUsage(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in RegionService.checkUsage(${id}):`, error);
      throw new AppError('Failed to check region usage', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
}

// Export a singleton instance
export const regionService = new RegionService();
