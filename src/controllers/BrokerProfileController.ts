import { Request, Response } from 'express';
import { brokerProfileService } from '../services/BrokerProfileService';
import { BrokerProfileDto, BrokerType, CreciType } from '../dtos/BrokerProfileDto';
import logger from '../utils/logger';

class BrokerProfileController {
  /**
   * Create a new broker profile
   * @param req Request
   * @param res Response
   */
  async createBrokerProfile(req: Request, res: Response): Promise<Response> {
    logger.info(`Creating broker profile: ${JSON.stringify(req.body)}`);
    
    try {
      const { type, creci, creci_type, classification, regions, neighborhoods } = req.body;
      
      const brokerProfile = await brokerProfileService.create({
        type: type as BrokerType,
        creci,
        creciType: creci_type as CreciType,
        classification,
        regions,
        neighborhoods,
      });
      
      logger.info(`Broker profile created with ID: ${brokerProfile.id}`);
      
      return res.status(201).json({
        success: true,
        data: brokerProfile,
        message: 'Broker profile created successfully',
      });
    } catch (error: any) {
      logger.error(`Error creating broker profile: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating the broker profile',
        },
      });
    }
  }

  /**
   * Get a broker profile by ID
   * @param req Request
   * @param res Response
   */
  async getBrokerProfileById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { include_regions, include_neighborhoods } = req.query;
    
    logger.info(`Getting broker profile with ID: ${id}, include_regions: ${include_regions}, include_neighborhoods: ${include_neighborhoods}`);
    
    try {
      const brokerProfile = await brokerProfileService.findById(
        id,
        include_regions === 'true',
        include_neighborhoods === 'true'
      );
      
      if (!brokerProfile) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Broker profile found with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        data: brokerProfile,
        message: 'Broker profile retrieved successfully',
      });
    } catch (error: any) {
      logger.error(`Error getting broker profile with ID ${id}: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while retrieving the broker profile',
        },
      });
    }
  }

  /**
   * Get broker profiles with filters
   * @param req Request
   * @param res Response
   */
  async getBrokerProfiles(req: Request, res: Response): Promise<Response> {
    const {
      type,
      creci_type,
      classification,
      region_id,
      neighborhood_id,
      page,
      limit,
      include_regions,
      include_neighborhoods,
      include_deleted,
    } = req.query;
    
    logger.info(`Getting broker profiles with filters: ${JSON.stringify(req.query)}`);
    
    try {
      const brokerProfiles = await brokerProfileService.findAll({
        type: type as BrokerType,
        creciType: creci_type as CreciType,
        classification: classification ? Number(classification) : undefined,
        regionId: region_id as string,
        neighborhoodId: neighborhood_id as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        includeRegions: include_regions === 'true',
        includeNeighborhoods: include_neighborhoods === 'true',
        includeDeleted: include_deleted === 'true',
      });
      
      logger.info(`Found ${brokerProfiles.length} broker profiles`);
      
      return res.status(200).json({
        success: true,
        data: brokerProfiles,
        message: 'Broker profiles retrieved successfully',
      });
    } catch (error: any) {
      logger.error(`Error getting broker profiles: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while retrieving broker profiles',
        },
      });
    }
  }

  /**
   * Update a broker profile
   * @param req Request
   * @param res Response
   */
  async updateBrokerProfile(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { type, creci, creci_type, classification } = req.body;
    
    logger.info(`Updating broker profile with ID: ${id}, data: ${JSON.stringify(req.body)}`);
    
    try {
      const brokerProfile = await brokerProfileService.update(id, {
        type: type as BrokerType,
        creci,
        creciType: creci_type as CreciType,
        classification,
      });
      
      if (!brokerProfile) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Broker profile updated with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        data: brokerProfile,
        message: 'Broker profile updated successfully',
      });
    } catch (error: any) {
      logger.error(`Error updating broker profile with ID ${id}: ${error.message}`);
      
      if (error.message.includes('deleted')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the broker profile',
        },
      });
    }
  }

  /**
   * Delete a broker profile
   * @param req Request
   * @param res Response
   */
  async deleteBrokerProfile(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    
    logger.info(`Deleting broker profile with ID: ${id}`);
    
    try {
      const deleted = await brokerProfileService.delete(id);
      
      if (!deleted) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Broker profile deleted with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Broker profile deleted successfully',
      });
    } catch (error: any) {
      logger.error(`Error deleting broker profile with ID ${id}: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting the broker profile',
        },
      });
    }
  }

  /**
   * Restore a broker profile
   * @param req Request
   * @param res Response
   */
  async restoreBrokerProfile(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    
    logger.info(`Restoring broker profile with ID: ${id}`);
    
    try {
      const restored = await brokerProfileService.restore(id);
      
      if (!restored) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Broker profile restored with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Broker profile restored successfully',
      });
    } catch (error: any) {
      logger.error(`Error restoring broker profile with ID ${id}: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while restoring the broker profile',
        },
      });
    }
  }

  /**
   * Update regions for a broker profile
   * @param req Request
   * @param res Response
   */
  async updateBrokerProfileRegions(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { region_ids } = req.body;
    
    logger.info(`Updating regions for broker profile with ID: ${id}, data: ${JSON.stringify(req.body)}`);
    
    try {
      const updated = await brokerProfileService.updateRegions(id, {
        regionIds: region_ids,
      });
      
      if (!updated) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Regions updated for broker profile with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Broker profile regions updated successfully',
      });
    } catch (error: any) {
      logger.error(`Error updating regions for broker profile with ID ${id}: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }
      
      if (error.message.includes('deleted')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating broker profile regions',
        },
      });
    }
  }

  /**
   * Add regions to a broker profile
   * @param req Request
   * @param res Response
   */
  async addBrokerProfileRegions(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { region_ids } = req.body;
    
    logger.info(`Adding regions to broker profile with ID: ${id}, data: ${JSON.stringify(req.body)}`);
    
    try {
      const added = await brokerProfileService.addRegions(id, {
        regionIds: region_ids,
      });
      
      if (!added) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Regions added to broker profile with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Regions added to broker profile successfully',
      });
    } catch (error: any) {
      logger.error(`Error adding regions to broker profile with ID ${id}: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }
      
      if (error.message.includes('deleted')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while adding regions to broker profile',
        },
      });
    }
  }

  /**
   * Remove a region from a broker profile
   * @param req Request
   * @param res Response
   */
  async removeBrokerProfileRegion(req: Request, res: Response): Promise<Response> {
    const { id, regionId } = req.params;
    
    logger.info(`Removing region ${regionId} from broker profile with ID: ${id}`);
    
    try {
      const removed = await brokerProfileService.removeRegion(id, regionId);
      
      if (!removed) {
        logger.warn(`Broker profile not found with ID: ${id} or region not associated`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found or region not associated',
          },
        });
      }
      
      logger.info(`Region ${regionId} removed from broker profile with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Region removed from broker profile successfully',
      });
    } catch (error: any) {
      logger.error(`Error removing region ${regionId} from broker profile with ID ${id}: ${error.message}`);
      
      if (error.message.includes('deleted')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while removing region from broker profile',
        },
      });
    }
  }

  /**
   * Get regions for a broker profile
   * @param req Request
   * @param res Response
   */
  async getBrokerProfileRegions(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    
    logger.info(`Getting regions for broker profile with ID: ${id}`);
    
    try {
      const brokerProfile = await brokerProfileService.findRegions(id);
      
      if (!brokerProfile) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Found ${brokerProfile.regions?.length || 0} regions for broker profile with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        data: brokerProfile.regions || [],
        message: 'Broker profile regions retrieved successfully',
      });
    } catch (error: any) {
      logger.error(`Error getting regions for broker profile with ID ${id}: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while retrieving broker profile regions',
        },
      });
    }
  }

  /**
   * Update neighborhoods for a broker profile
   * @param req Request
   * @param res Response
   */
  async updateBrokerProfileNeighborhoods(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { neighborhood_ids } = req.body;
    
    logger.info(`Updating neighborhoods for broker profile with ID: ${id}, data: ${JSON.stringify(req.body)}`);
    
    try {
      const updated = await brokerProfileService.updateNeighborhoods(id, {
        neighborhoodIds: neighborhood_ids,
      });
      
      if (!updated) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Neighborhoods updated for broker profile with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Broker profile neighborhoods updated successfully',
      });
    } catch (error: any) {
      logger.error(`Error updating neighborhoods for broker profile with ID ${id}: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }
      
      if (error.message.includes('deleted')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating broker profile neighborhoods',
        },
      });
    }
  }

  /**
   * Add neighborhoods to a broker profile
   * @param req Request
   * @param res Response
   */
  async addBrokerProfileNeighborhoods(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { neighborhood_ids } = req.body;
    
    logger.info(`Adding neighborhoods to broker profile with ID: ${id}, data: ${JSON.stringify(req.body)}`);
    
    try {
      const added = await brokerProfileService.addNeighborhoods(id, {
        neighborhoodIds: neighborhood_ids,
      });
      
      if (!added) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Neighborhoods added to broker profile with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Neighborhoods added to broker profile successfully',
      });
    } catch (error: any) {
      logger.error(`Error adding neighborhoods to broker profile with ID ${id}: ${error.message}`);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      }
      
      if (error.message.includes('deleted')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while adding neighborhoods to broker profile',
        },
      });
    }
  }

  /**
   * Remove a neighborhood from a broker profile
   * @param req Request
   * @param res Response
   */
  async removeBrokerProfileNeighborhood(req: Request, res: Response): Promise<Response> {
    const { id, neighborhoodId } = req.params;
    
    logger.info(`Removing neighborhood ${neighborhoodId} from broker profile with ID: ${id}`);
    
    try {
      const removed = await brokerProfileService.removeNeighborhood(id, neighborhoodId);
      
      if (!removed) {
        logger.warn(`Broker profile not found with ID: ${id} or neighborhood not associated`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found or neighborhood not associated',
          },
        });
      }
      
      logger.info(`Neighborhood ${neighborhoodId} removed from broker profile with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: 'Neighborhood removed from broker profile successfully',
      });
    } catch (error: any) {
      logger.error(`Error removing neighborhood ${neighborhoodId} from broker profile with ID ${id}: ${error.message}`);
      
      if (error.message.includes('deleted')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: error.message,
          },
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while removing neighborhood from broker profile',
        },
      });
    }
  }

  /**
   * Get neighborhoods for a broker profile
   * @param req Request
   * @param res Response
   */
  async getBrokerProfileNeighborhoods(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    
    logger.info(`Getting neighborhoods for broker profile with ID: ${id}`);
    
    try {
      const brokerProfile = await brokerProfileService.findNeighborhoods(id);
      
      if (!brokerProfile) {
        logger.warn(`Broker profile not found with ID: ${id}`);
        
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Broker profile not found',
          },
        });
      }
      
      logger.info(`Found ${brokerProfile.neighborhoods?.length || 0} neighborhoods for broker profile with ID: ${id}`);
      
      return res.status(200).json({
        success: true,
        data: brokerProfile.neighborhoods || [],
        message: 'Broker profile neighborhoods retrieved successfully',
      });
    } catch (error: any) {
      logger.error(`Error getting neighborhoods for broker profile with ID ${id}: ${error.message}`);
      
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while retrieving broker profile neighborhoods',
        },
      });
    }
  }
}

// Export a singleton instance
export const brokerProfileController = new BrokerProfileController();
