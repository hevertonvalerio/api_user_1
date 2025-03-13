import { AppError } from '../middlewares/ErrorHandlerMiddleware';
import { neighborhoodRepository } from '../repositories/NeighborhoodRepository';
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
 * Service for neighborhoods
 */
export class NeighborhoodService {
  /**
   * Create a new neighborhood
   * @param data Neighborhood data
   * @returns Created neighborhood
   */
  async create(data: CreateNeighborhoodDto): Promise<NeighborhoodDto> {
    try {
      logger.info(`Creating neighborhood ${data.name} in ${data.city}`);
      
      // Check if neighborhood already exists
      const exists = await neighborhoodRepository.existsByNameAndCity(data.name, data.city);
      if (exists) {
        throw new AppError(`Neighborhood ${data.name} already exists in ${data.city}`, 409, 'CONFLICT');
      }
      
      // Create neighborhood
      return await neighborhoodRepository.create(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error in NeighborhoodService.create:', error);
      throw new AppError('Failed to create neighborhood', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Create multiple neighborhoods in batch
   * @param data Batch creation data
   * @returns Created neighborhoods
   */
  async createBatch(data: CreateBatchNeighborhoodDto): Promise<NeighborhoodDto[]> {
    try {
      logger.info(`Creating ${data.neighborhoods.length} neighborhoods in ${data.city}`);
      
      // Check if any neighborhoods already exist
      const existingNeighborhoods = [];
      for (const name of data.neighborhoods) {
        const exists = await neighborhoodRepository.existsByNameAndCity(name, data.city);
        if (exists) {
          existingNeighborhoods.push(name);
        }
      }
      
      if (existingNeighborhoods.length > 0) {
        throw new AppError(
          `The following neighborhoods already exist in ${data.city}: ${existingNeighborhoods.join(', ')}`,
          409,
          'CONFLICT'
        );
      }
      
      // Create neighborhoods
      return await neighborhoodRepository.createMany(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error in NeighborhoodService.createBatch:', error);
      throw new AppError('Failed to create neighborhoods', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Find a neighborhood by ID
   * @param id Neighborhood ID
   * @returns Neighborhood or null if not found
   */
  async findById(id: string): Promise<NeighborhoodDto> {
    try {
      logger.info(`Finding neighborhood with ID ${id}`);
      
      const neighborhood = await neighborhoodRepository.findById(id);
      
      if (!neighborhood) {
        throw new AppError(`Neighborhood with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      return neighborhood;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in NeighborhoodService.findById(${id}):`, error);
      throw new AppError('Failed to find neighborhood', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Find neighborhoods by filter criteria
   * @param filters Filter criteria
   * @returns Filtered neighborhoods
   */
  async findAll(filters: NeighborhoodFilters): Promise<NeighborhoodDto[]> {
    try {
      logger.info(`Finding neighborhoods with filters: ${JSON.stringify(filters)}`);
      
      return await neighborhoodRepository.findAll(filters);
    } catch (error) {
      logger.error('Error in NeighborhoodService.findAll:', error);
      throw new AppError('Failed to find neighborhoods', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Update a neighborhood
   * @param id Neighborhood ID
   * @param data Update data
   * @returns Updated neighborhood
   */
  async update(id: string, data: UpdateNeighborhoodDto): Promise<NeighborhoodDto> {
    try {
      logger.info(`Updating neighborhood with ID ${id}`);
      
      // Check if neighborhood exists
      const neighborhood = await neighborhoodRepository.findById(id);
      if (!neighborhood) {
        throw new AppError(`Neighborhood with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      // Check if the updated name and city would create a duplicate
      if (data.name !== undefined && data.city !== undefined) {
        const exists = await neighborhoodRepository.existsByNameAndCity(data.name, data.city, id);
        if (exists) {
          throw new AppError(`Neighborhood ${data.name} already exists in ${data.city}`, 409, 'CONFLICT');
        }
      } else if (data.name !== undefined) {
        const exists = await neighborhoodRepository.existsByNameAndCity(data.name, neighborhood.city, id);
        if (exists) {
          throw new AppError(`Neighborhood ${data.name} already exists in ${neighborhood.city}`, 409, 'CONFLICT');
        }
      } else if (data.city !== undefined) {
        const exists = await neighborhoodRepository.existsByNameAndCity(neighborhood.name, data.city, id);
        if (exists) {
          throw new AppError(`Neighborhood ${neighborhood.name} already exists in ${data.city}`, 409, 'CONFLICT');
        }
      }
      
      // Update neighborhood
      const updatedNeighborhood = await neighborhoodRepository.update(id, data);
      
      if (!updatedNeighborhood) {
        throw new AppError(`Failed to update neighborhood with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
      
      return updatedNeighborhood;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in NeighborhoodService.update(${id}):`, error);
      throw new AppError('Failed to update neighborhood', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Delete a neighborhood
   * @param id Neighborhood ID
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info(`Deleting neighborhood with ID ${id}`);
      
      // Check if neighborhood exists
      const neighborhood = await neighborhoodRepository.findById(id);
      if (!neighborhood) {
        throw new AppError(`Neighborhood with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      // Check if neighborhood is being used
      const usage = await neighborhoodRepository.checkUsage(id);
      if (usage.isUsed) {
        throw new AppError(
          `Cannot delete neighborhood with ID ${id} because it is being used in: ${usage.usedIn.join(', ')}`,
          403,
          'FORBIDDEN'
        );
      }
      
      // Delete neighborhood
      const deleted = await neighborhoodRepository.delete(id);
      
      if (!deleted) {
        throw new AppError(`Failed to delete neighborhood with ID ${id}`, 500, 'INTERNAL_SERVER_ERROR');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in NeighborhoodService.delete(${id}):`, error);
      throw new AppError('Failed to delete neighborhood', 500, 'INTERNAL_SERVER_ERROR');
    }
  }

  /**
   * Check if a neighborhood is being used
   * @param id Neighborhood ID
   * @returns Usage information
   */
  async checkUsage(id: string): Promise<NeighborhoodUsageDto> {
    try {
      logger.info(`Checking usage of neighborhood with ID ${id}`);
      
      // Check if neighborhood exists
      const neighborhood = await neighborhoodRepository.findById(id);
      if (!neighborhood) {
        throw new AppError(`Neighborhood with ID ${id} not found`, 404, 'NOT_FOUND');
      }
      
      return await neighborhoodRepository.checkUsage(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error in NeighborhoodService.checkUsage(${id}):`, error);
      throw new AppError('Failed to check neighborhood usage', 500, 'INTERNAL_SERVER_ERROR');
    }
  }
}

// Export a singleton instance
export const neighborhoodService = new NeighborhoodService();
