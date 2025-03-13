import { Router } from 'express';
import { memberController } from '../controllers/MemberController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';
import { validationErrorHandler } from '../middlewares/ErrorHandlerMiddleware';
import {
  createMemberValidation,
  updateMemberValidation,
  updateMemberStatusValidation,
} from '../utils/validateInput';

const router = Router();

/**
 * @swagger
 * /api/members:
 *   post:
 *     summary: Cria um novo membro
 *     tags: [Members]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - teamId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do membro
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do membro
 *               phone:
 *                 type: string
 *                 description: Telefone do membro
 *               isLeader:
 *                 type: boolean
 *                 description: Se o membro é líder da equipe
 *               teamId:
 *                 type: string
 *                 format: uuid
 *                 description: ID da equipe à qual o membro pertence
 *     responses:
 *       201:
 *         description: Membro criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Equipe não encontrada
 *       409:
 *         description: Email já em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/',
  apiKeyMiddleware as any,
  createMemberValidation as any,
  validationErrorHandler as any,
  memberController.create as any
);

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Lista todos os membros
 *     tags: [Members]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtro por nome (parcial)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtro por email (parcial)
 *       - in: query
 *         name: is_leader
 *         schema:
 *           type: boolean
 *         description: Filtro por status de liderança
 *       - in: query
 *         name: team_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtro por equipe
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtro por status ativo/inativo
 *     responses:
 *       200:
 *         description: Lista de membros
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  '/',
  apiKeyMiddleware as any,
  memberController.findAll as any
);

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: Busca um membro pelo ID
 *     tags: [Members]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do membro
 *       - in: query
 *         name: include_team
 *         schema:
 *           type: boolean
 *         description: Se deve incluir a equipe na resposta
 *     responses:
 *       200:
 *         description: Membro encontrado
 *       404:
 *         description: Membro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  '/:id',
  apiKeyMiddleware as any,
  memberController.findById as any
);

/**
 * @swagger
 * /api/members/{id}:
 *   put:
 *     summary: Atualiza um membro
 *     tags: [Members]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do membro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do membro
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do membro
 *               phone:
 *                 type: string
 *                 description: Telefone do membro
 *               isLeader:
 *                 type: boolean
 *                 description: Se o membro é líder da equipe
 *               teamId:
 *                 type: string
 *                 format: uuid
 *                 description: ID da equipe à qual o membro pertence
 *     responses:
 *       200:
 *         description: Membro atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Membro ou equipe não encontrado
 *       409:
 *         description: Email já em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
  '/:id',
  apiKeyMiddleware as any,
  updateMemberValidation as any,
  validationErrorHandler as any,
  memberController.update as any
);

/**
 * @swagger
 * /api/members/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um membro
 *     tags: [Members]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do membro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - active
 *             properties:
 *               active:
 *                 type: boolean
 *                 description: Status ativo/inativo do membro
 *     responses:
 *       200:
 *         description: Status do membro atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou membro é o único líder ativo da equipe
 *       404:
 *         description: Membro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch(
  '/:id/status',
  apiKeyMiddleware as any,
  updateMemberStatusValidation as any,
  validationErrorHandler as any,
  memberController.updateStatus as any
);

/**
 * @swagger
 * /api/members/{id}:
 *   delete:
 *     summary: Exclui um membro
 *     tags: [Members]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do membro
 *     responses:
 *       200:
 *         description: Membro excluído com sucesso
 *       400:
 *         description: Membro é o único líder da equipe
 *       404:
 *         description: Membro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete(
  '/:id',
  apiKeyMiddleware as any,
  memberController.delete as any
);

export default router;
