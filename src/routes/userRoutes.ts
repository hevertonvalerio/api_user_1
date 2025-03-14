import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';
import { validationErrorHandler } from '../middlewares/ErrorHandlerMiddleware';
import {
  createUserValidation,
  updateUserValidation,
  changePasswordValidation,
  getUserValidation,
  deleteUserValidation,
} from '../utils/validateInput';

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  '/',
  apiKeyMiddleware as any,
  createUserValidation,
  validationErrorHandler as any,
  userController.createUser as any
);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Usuário atualizado com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  '/:userId',
  apiKeyMiddleware as any,
  updateUserValidation,
  validationErrorHandler as any,
  userController.updateUser as any
);

/**
 * @swagger
 * /users/{userId}/password:
 *   patch:
 *     summary: Altera a senha de um usuário
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
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
 *                   example: Senha alterada com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch(
  '/:userId/password',
  apiKeyMiddleware as any,
  changePasswordValidation,
  validationErrorHandler as any,
  userController.changePassword as any
);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Remove um usuário (soft delete)
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
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
 *                   example: Usuário removido com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete(
  '/:userId',
  apiKeyMiddleware as any,
  deleteUserValidation,
  validationErrorHandler as any,
  userController.softDeleteUser as any
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Busca usuários por parâmetros
 *     tags: [Users]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email do usuário
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do usuário (busca parcial)
 *       - in: query
 *         name: userTypeId
 *         schema:
 *           type: integer
 *         description: ID do tipo de usuário
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *         description: Incluir usuários removidos
 *     responses:
 *       200:
 *         description: Lista de usuários
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
 *                     $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Usuários encontrados com sucesso
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  '/',
  apiKeyMiddleware as any,
  getUserValidation,
  validationErrorHandler as any,
  userController.getUserByQuery as any
);

export default router;
