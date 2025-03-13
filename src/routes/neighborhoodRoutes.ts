import { Router } from 'express';
import { neighborhoodController } from '../controllers/NeighborhoodController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';
import { validationErrorHandler } from '../middlewares/ErrorHandlerMiddleware';
import { createNeighborhoodValidation, createBatchNeighborhoodValidation, updateNeighborhoodValidation } from '../utils/validateInput';

const router = Router();

/**
 * @swagger
 * /neighborhoods:
 *   post:
 *     summary: Create a new neighborhood
 *     description: Create a new neighborhood with the provided data
 *     tags: [Neighborhoods]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNeighborhood'
 *     responses:
 *       201:
 *         description: Neighborhood created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Neighborhood'
 *                 message:
 *                   type: string
 *                   example: Neighborhood created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/',
  apiKeyMiddleware as any,
  createNeighborhoodValidation as any,
  validationErrorHandler as any,
  neighborhoodController.create
);

/**
 * @swagger
 * /neighborhoods/batch:
 *   post:
 *     summary: Create multiple neighborhoods in batch
 *     description: Create multiple neighborhoods in the same city
 *     tags: [Neighborhoods]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBatchNeighborhood'
 *     responses:
 *       201:
 *         description: Neighborhoods created successfully
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
 *                     $ref: '#/components/schemas/Neighborhood'
 *                 message:
 *                   type: string
 *                   example: Neighborhoods created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/batch',
  apiKeyMiddleware as any,
  createBatchNeighborhoodValidation as any,
  validationErrorHandler as any,
  neighborhoodController.createBatch
);

/**
 * @swagger
 * /neighborhoods/{id}:
 *   get:
 *     summary: Get a neighborhood by ID
 *     description: Retrieve a neighborhood by its ID
 *     tags: [Neighborhoods]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the neighborhood to retrieve
 *     responses:
 *       200:
 *         description: Neighborhood retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Neighborhood'
 *                 message:
 *                   type: string
 *                   example: Neighborhood retrieved successfully
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
  neighborhoodController.findById
);

/**
 * @swagger
 * /neighborhoods:
 *   get:
 *     summary: Get neighborhoods with optional filters
 *     description: Retrieve neighborhoods with optional name and city filters
 *     tags: [Neighborhoods]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by neighborhood name (partial match)
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city (exact match)
 *     responses:
 *       200:
 *         description: Neighborhoods retrieved successfully
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
 *                     $ref: '#/components/schemas/Neighborhood'
 *                 message:
 *                   type: string
 *                   example: Neighborhoods retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/',
  apiKeyMiddleware as any,
  neighborhoodController.findAll
);

/**
 * @swagger
 * /neighborhoods/{id}:
 *   put:
 *     summary: Update a neighborhood
 *     description: Update a neighborhood with the provided data
 *     tags: [Neighborhoods]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the neighborhood to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNeighborhood'
 *     responses:
 *       200:
 *         description: Neighborhood updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Neighborhood'
 *                 message:
 *                   type: string
 *                   example: Neighborhood updated successfully
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
  updateNeighborhoodValidation as any,
  validationErrorHandler as any,
  neighborhoodController.update
);

/**
 * @swagger
 * /neighborhoods/{id}:
 *   delete:
 *     summary: Delete a neighborhood
 *     description: Delete a neighborhood by its ID
 *     tags: [Neighborhoods]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the neighborhood to delete
 *     responses:
 *       200:
 *         description: Neighborhood deleted successfully
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
 *                   example: Neighborhood deleted successfully
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
  neighborhoodController.delete
);

/**
 * @swagger
 * /neighborhoods/{id}/usage:
 *   get:
 *     summary: Check if a neighborhood is being used
 *     description: Check if a neighborhood is being used by regions or other modules
 *     tags: [Neighborhoods]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the neighborhood to check
 *     responses:
 *       200:
 *         description: Neighborhood usage checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/NeighborhoodUsage'
 *                 message:
 *                   type: string
 *                   example: Neighborhood usage checked successfully
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
  neighborhoodController.checkUsage
);

export default router;
