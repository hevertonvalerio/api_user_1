import { Router } from 'express';
import { regionController } from '../controllers/RegionController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';
import { validationErrorHandler } from '../middlewares/ErrorHandlerMiddleware';
import { 
  createRegionValidation, 
  updateRegionValidation, 
  updateRegionNeighborhoodsValidation,
  addRegionNeighborhoodsValidation
} from '../utils/validateInput';

const router = Router();

/**
 * @swagger
 * /regions:
 *   post:
 *     summary: Create a new region
 *     description: Create a new region with optional neighborhood associations
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRegion'
 *     responses:
 *       201:
 *         description: Region created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Region'
 *                 message:
 *                   type: string
 *                   example: Region created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/',
  apiKeyMiddleware as any,
  createRegionValidation as any,
  validationErrorHandler as any,
  regionController.create
);

/**
 * @swagger
 * /regions/{id}:
 *   get:
 *     summary: Get a region by ID
 *     description: Retrieve a region by its ID with optional neighborhood inclusion
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the region to retrieve
 *       - in: query
 *         name: include_neighborhoods
 *         schema:
 *           type: boolean
 *         description: Whether to include neighborhoods in the response
 *     responses:
 *       200:
 *         description: Region retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Region'
 *                 message:
 *                   type: string
 *                   example: Region retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/:id',
  apiKeyMiddleware as any,
  regionController.findById
);

/**
 * @swagger
 * /regions:
 *   get:
 *     summary: Get regions with optional filters
 *     description: Retrieve regions with optional name filter and neighborhood inclusion
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by region name (partial match)
 *       - in: query
 *         name: include_neighborhoods
 *         schema:
 *           type: boolean
 *         description: Whether to include neighborhoods in the response
 *     responses:
 *       200:
 *         description: Regions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Region'
 *                 message:
 *                   type: string
 *                   example: Regions retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/',
  apiKeyMiddleware as any,
  regionController.findAll
);

/**
 * @swagger
 * /regions/{id}:
 *   put:
 *     summary: Update a region
 *     description: Update a region's name
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the region to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRegion'
 *     responses:
 *       200:
 *         description: Region updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Region'
 *                 message:
 *                   type: string
 *                   example: Region updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  '/:id',
  apiKeyMiddleware as any,
  updateRegionValidation as any,
  validationErrorHandler as any,
  regionController.update
);

/**
 * @swagger
 * /regions/{id}/neighborhoods:
 *   put:
 *     summary: Update region neighborhoods
 *     description: Replace all neighborhood associations for a region
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the region to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRegionNeighborhoods'
 *     responses:
 *       200:
 *         description: Region neighborhoods updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Region neighborhoods updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  '/:id/neighborhoods',
  apiKeyMiddleware as any,
  updateRegionNeighborhoodsValidation as any,
  validationErrorHandler as any,
  regionController.updateNeighborhoods
);

/**
 * @swagger
 * /regions/{id}/neighborhoods:
 *   post:
 *     summary: Add neighborhoods to a region
 *     description: Add one or more neighborhoods to an existing region
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the region to add neighborhoods to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddNeighborhoods'
 *     responses:
 *       200:
 *         description: Neighborhoods added to region successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Neighborhoods added to region successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/:id/neighborhoods',
  apiKeyMiddleware as any,
  addRegionNeighborhoodsValidation as any,
  validationErrorHandler as any,
  regionController.addNeighborhoods
);

/**
 * @swagger
 * /regions/{id}/neighborhoods/{neighborhoodId}:
 *   delete:
 *     summary: Remove a neighborhood from a region
 *     description: Remove a specific neighborhood from a region
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the region
 *       - in: path
 *         name: neighborhoodId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the neighborhood to remove
 *     responses:
 *       200:
 *         description: Neighborhood removed from region successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Neighborhood removed from region successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  '/:id/neighborhoods/:neighborhoodId',
  apiKeyMiddleware as any,
  regionController.removeNeighborhood
);

/**
 * @swagger
 * /regions/{id}:
 *   delete:
 *     summary: Delete a region
 *     description: Delete a region by its ID
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the region to delete
 *     responses:
 *       200:
 *         description: Region deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Region deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  '/:id',
  apiKeyMiddleware as any,
  regionController.delete
);

/**
 * @swagger
 * /regions/{id}/usage:
 *   get:
 *     summary: Check if a region is being used
 *     description: Check if a region is being used by other modules
 *     tags: [Regions]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the region to check
 *     responses:
 *       200:
 *         description: Region usage checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RegionUsage'
 *                 message:
 *                   type: string
 *                   example: Region usage checked successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/:id/usage',
  apiKeyMiddleware as any,
  regionController.checkUsage
);

export default router;
