import { Request, Response, NextFunction } from 'express';
import { regionService } from '../services/RegionService';
import { 
  CreateRegionDto, 
  UpdateRegionDto, 
  RegionFilters,
  UpdateRegionNeighborhoodsDto,
  AddNeighborhoodsDto
} from '../dtos/RegionDto';
import logger from '../utils/logger';

/**
 * Controller for regions
 */
export class RegionController {
  /**
   * Create a new region
   * @route POST /api/regions
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateRegionDto = req.body;
      
      logger.info(`Creating region with name ${data.name}`);
      
      const region = await regionService.create(data);
      
      res.status(201).json({
        success: true,
        data: region,
        message: 'Region created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find a region by ID
   * @route GET /api/regions/:id
   */
  findById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const includeNeighborhoods = req.query.include_neighborhoods === 'true';
      
      logger.info(`Finding region with ID ${id}`);
      
      const region = await regionService.findById(id, includeNeighborhoods);
      
      res.status(200).json({
        success: true,
        data: region,
        message: 'Region retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find regions by filter criteria
   * @route GET /api/regions
   */
  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: RegionFilters = {
        name: req.query.name as string | undefined,
        include_neighborhoods: req.query.include_neighborhoods === 'true',
      };
      
      logger.info(`Finding regions with filters: ${JSON.stringify(filters)}`);
      
      const regions = await regionService.findAll(filters);
      
      res.status(200).json({
        success: true,
        data: regions,
        message: 'Regions retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a region
   * @route PUT /api/regions/:id
   */
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const data: UpdateRegionDto = req.body;
      
      logger.info(`Updating region with ID ${id}`);
      
      const region = await regionService.update(id, data);
      
      res.status(200).json({
        success: true,
        data: region,
        message: 'Region updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the neighborhoods associated with a region
   * @route PUT /api/regions/:id/neighborhoods
   */
  updateNeighborhoods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const data: UpdateRegionNeighborhoodsDto = req.body;
      
      logger.info(`Updating neighborhoods for region with ID ${id}`);
      
      await regionService.updateNeighborhoods(id, data);
      
      res.status(200).json({
        success: true,
        message: 'Region neighborhoods updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add neighborhoods to a region
   * @route POST /api/regions/:id/neighborhoods
   */
  addNeighborhoods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const data: AddNeighborhoodsDto = req.body;
      
      logger.info(`Adding neighborhoods to region with ID ${id}`);
      
      await regionService.addNeighborhoods(id, data);
      
      res.status(200).json({
        success: true,
        message: 'Neighborhoods added to region successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a neighborhood from a region
   * @route DELETE /api/regions/:id/neighborhoods/:neighborhoodId
   */
  removeNeighborhood = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const regionId = req.params.id;
      const neighborhoodId = req.params.neighborhoodId;
      
      logger.info(`Removing neighborhood ${neighborhoodId} from region ${regionId}`);
      
      await regionService.removeNeighborhood(regionId, neighborhoodId);
      
      res.status(200).json({
        success: true,
        message: 'Neighborhood removed from region successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a region
   * @route DELETE /api/regions/:id
   */
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      
      logger.info(`Deleting region with ID ${id}`);
      
      await regionService.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Region deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check if a region is being used
   * @route GET /api/regions/:id/usage
   */
  checkUsage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      
      logger.info(`Checking usage of region with ID ${id}`);
      
      const usage = await regionService.checkUsage(id);
      
      res.status(200).json({
        success: true,
        data: usage,
        message: 'Region usage checked successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export a singleton instance
export const regionController = new RegionController();
