import { Router } from 'express';
import { teamController } from '../controllers/TeamController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';
import { validationErrorHandler } from '../middlewares/ErrorHandlerMiddleware';
import {
  createTeamValidation,
  updateTeamValidation,
  setTeamLeaderValidation,
} from '../utils/validateInput';

const router = Router();

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Cria uma nova equipe
 *     tags: [Teams]
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
 *               - teamType
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da equipe
 *               teamType:
 *                 type: string
 *                 enum: [Corretores, Cadastro, Jurídico, Atendimento, Administrativo]
 *                 description: Tipo da equipe
 *     responses:
 *       201:
 *         description: Equipe criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/',
  apiKeyMiddleware as any,
  createTeamValidation as any,
  validationErrorHandler as any,
  teamController.create as any
);

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Lista todas as equipes
 *     tags: [Teams]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtro por nome (parcial)
 *       - in: query
 *         name: team_type
 *         schema:
 *           type: string
 *           enum: [Corretores, Cadastro, Jurídico, Atendimento, Administrativo]
 *         description: Filtro por tipo de equipe
 *       - in: query
 *         name: include_members
 *         schema:
 *           type: boolean
 *         description: Se deve incluir os membros na resposta
 *     responses:
 *       200:
 *         description: Lista de equipes
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  '/',
  apiKeyMiddleware as any,
  teamController.findAll as any
);

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Busca uma equipe pelo ID
 *     tags: [Teams]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da equipe
 *       - in: query
 *         name: include_members
 *         schema:
 *           type: boolean
 *         description: Se deve incluir os membros na resposta
 *     responses:
 *       200:
 *         description: Equipe encontrada
 *       404:
 *         description: Equipe não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  '/:id',
  apiKeyMiddleware as any,
  teamController.findById as any
);

/**
 * @swagger
 * /teams/{id}:
 *   put:
 *     summary: Atualiza uma equipe
 *     tags: [Teams]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da equipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da equipe
 *               teamType:
 *                 type: string
 *                 enum: [Corretores, Cadastro, Jurídico, Atendimento, Administrativo]
 *                 description: Tipo da equipe
 *     responses:
 *       200:
 *         description: Equipe atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Equipe não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
  '/:id',
  apiKeyMiddleware as any,
  updateTeamValidation as any,
  validationErrorHandler as any,
  teamController.update as any
);

/**
 * @swagger
 * /teams/{id}/leader:
 *   put:
 *     summary: Define um membro como líder da equipe
 *     tags: [Teams]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da equipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - member_id
 *             properties:
 *               member_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID do membro
 *     responses:
 *       200:
 *         description: Líder definido com sucesso
 *       400:
 *         description: Dados inválidos ou membro não pertence à equipe
 *       404:
 *         description: Equipe ou membro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
  '/:id/leader',
  apiKeyMiddleware as any,
  setTeamLeaderValidation as any,
  validationErrorHandler as any,
  teamController.setLeader as any
);

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     summary: Exclui uma equipe
 *     tags: [Teams]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da equipe
 *     responses:
 *       200:
 *         description: Equipe excluída com sucesso
 *       404:
 *         description: Equipe não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete(
  '/:id',
  apiKeyMiddleware as any,
  teamController.delete as any
);

/**
 * @swagger
 * /teams/{id}/members:
 *   get:
 *     summary: Lista os membros de uma equipe
 *     tags: [Teams]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da equipe
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtro por status ativo/inativo
 *     responses:
 *       200:
 *         description: Lista de membros da equipe
 *       404:
 *         description: Equipe não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
  '/:id/members',
  apiKeyMiddleware as any,
  teamController.findMembers as any
);

export default router;
