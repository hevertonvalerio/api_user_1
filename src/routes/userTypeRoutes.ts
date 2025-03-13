import { Router } from 'express';
import { userTypeController } from '../controllers/UserTypeController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';

const router = Router();

/**
 * @swagger
 * /api/user-types:
 *   get:
 *     summary: Lista todos os tipos de usuário
 *     tags: [UserTypes]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de usuário
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
 *                     $ref: '#/components/schemas/UserType'
 *                 message:
 *                   type: string
 *                   example: Tipos de usuário encontrados com sucesso
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', apiKeyMiddleware as any, userTypeController.getAllUserTypes as any);

export default router;
