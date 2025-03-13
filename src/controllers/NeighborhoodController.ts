import { Request, Response, NextFunction } from 'express';
import { neighborhoodService } from '../services/NeighborhoodService';
import { 
  CreateNeighborhoodDto, 
  CreateBatchNeighborhoodDto,
  UpdateNeighborhoodDto, 
  NeighborhoodFilters
} from '../dtos/NeighborhoodDto';
import logger from '../utils/logger';

/**
 * Controller for neighborhoods
 */
export class NeighborhoodController {
  /**
   * Create a new neighborhood
   * @route POST /api/neighborhoods
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateNeighborhoodDto = req.body;
      
      logger.info(`Creating neighborhood with name ${data.name} in ${data.city}`);
      
      const neighborhood = await neighborhoodService.create(data);
      
      res.status(201).json({
        success: true,
        data: neighborhood,
        message: 'Neighborhood created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create multiple neighborhoods in batch
   * @route POST /api/neighborhoods/batch
   */
  createBatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateBatchNeighborhoodDto = req.body;
      
      logger.info(`Creating ${data.neighborhoods.length} neighborhoods in ${data.city}`);
      
      const neighborhoods = await neighborhoodService.createBatch(data);
      
      res.status(201).json({
        success: true,
        data: neighborhoods,
        message: 'Neighborhoods created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find a neighborhood by ID
   * @route GET /api/neighborhoods/:id
   */
  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      
      logger.info(`Finding neighborhood with ID ${id}`);
      
      const neighborhood = await neighborhoodService.findById(id);
      
      res.status(200).json({
        success: true,
        data: neighborhood,
        message: 'Neighborhood retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find neighborhoods by filter criteria
   * @route GET /api/neighborhoods
   */
  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: NeighborhoodFilters = {
        name: req.query.name as string | undefined,
        city: req.query.city as string | undefined,
      };
      
      logger.info(`Finding neighborhoods with filters: ${JSON.stringify(filters)}`);
      
      const neighborhoods = await neighborhoodService.findAll(filters);
      
      res.status(200).json({
        success: true,
        data: neighborhoods,
        message: 'Neighborhoods retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a neighborhood
   * @route PUT /api/neighborhoods/:id
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const data: UpdateNeighborhoodDto = req.body;
      
      logger.info(`Updating neighborhood with ID ${id}`);
      
      const neighborhood = await neighborhoodService.update(id, data);
      
      res.status(200).json({
        success: true,
        data: neighborhood,
        message: 'Neighborhood updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a neighborhood
   * @route DELETE /api/neighborhoods/:id
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      
      logger.info(`Deleting neighborhood with ID ${id}`);
      
      await neighborhoodService.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Neighborhood deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check if a neighborhood is being used
   * @route GET /api/neighborhoods/:id/usage
   */
  checkUsage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      
      logger.info(`Checking usage of neighborhood with ID ${id}`);
      
      const usage = await neighborhoodService.checkUsage(id);
      
      res.status(200).json({
        success: true,
        data: usage,
        message: 'Neighborhood usage checked successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export a singleton instance
export const neighborhoodController = new NeighborhoodController();
