import { Router } from 'express';
import { brokerProfileController } from '../controllers/BrokerProfileController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: BrokerProfiles
 *   description: API para gerenciamento de perfis de corretores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BrokerType:
 *       type: string
 *       enum: [Locação, Venda, Híbrido]
 *       description: Tipo de corretor
 *     
 *     CreciType:
 *       type: string
 *       enum: [Definitivo, Estagiário, Matrícula]
 *       description: Tipo de CRECI
 *     
 *     BrokerProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do perfil do corretor
 *         type:
 *           $ref: '#/components/schemas/BrokerType'
 *         creci:
 *           type: string
 *           description: Número do registro CRECI
 *         creciType:
 *           $ref: '#/components/schemas/CreciType'
 *         classification:
 *           type: integer
 *           description: Classificação do corretor
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de última atualização
 *         deleted:
 *           type: boolean
 *           description: Flag para exclusão lógica
 *           default: false
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Data de exclusão lógica
 *         regions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Region'
 *           description: Regiões de atuação do corretor
 *         neighborhoods:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Neighborhood'
 *           description: Bairros de atuação do corretor
 *       required:
 *         - type
 *         - creci
 *         - creciType
 *     
 *     CreateBrokerProfile:
 *       type: object
 *       properties:
 *         type:
 *           $ref: '#/components/schemas/BrokerType'
 *         creci:
 *           type: string
 *           description: Número do registro CRECI
 *         creci_type:
 *           $ref: '#/components/schemas/CreciType'
 *         classification:
 *           type: integer
 *           description: Classificação do corretor
 *           default: 0
 *         regions:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: IDs das regiões de atuação
 *         neighborhoods:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: IDs dos bairros de atuação
 *       required:
 *         - type
 *         - creci
 *         - creci_type
 *     
 *     UpdateBrokerProfile:
 *       type: object
 *       properties:
 *         type:
 *           $ref: '#/components/schemas/BrokerType'
 *         creci:
 *           type: string
 *           description: Número do registro CRECI
 *         creci_type:
 *           $ref: '#/components/schemas/CreciType'
 *         classification:
 *           type: integer
 *           description: Classificação do corretor
 *     
 *     UpdateRegions:
 *       type: object
 *       properties:
 *         regions:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: IDs das regiões
 *       required:
 *         - regions
 *     
 *     UpdateNeighborhoods:
 *       type: object
 *       properties:
 *         neighborhoods:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: IDs dos bairros
 *       required:
 *         - neighborhoods
 */

/**
 * @swagger
 * /broker-profiles:
 *   post:
 *     summary: Cria um novo perfil de corretor
 *     tags: [BrokerProfiles]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBrokerProfile'
 *     responses:
 *       201:
 *         description: Perfil de corretor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BrokerProfile'
 *                 message:
 *                   type: string
 *                   example: Perfil de corretor criado com sucesso
 *       404:
 *         description: Região ou bairro não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', apiKeyMiddleware as any, brokerProfileController.create.bind(brokerProfileController));

/**
 * @swagger
 * /broker-profiles/{id}:
 *   get:
 *     summary: Obtém um perfil de corretor pelo ID
 *     tags: [BrokerProfiles]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do perfil de corretor
 *       - in: query
 *         name: include_regions
 *         schema:
 *           type: boolean
 *         description: Se deve incluir as regiões do corretor
 *       - in: query
 *         name: include_neighborhoods
 *         schema:
 *           type: boolean
 *         description: Se deve incluir os bairros do corretor
 *     responses:
 *       200:
 *         description: Perfil de corretor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BrokerProfile'
 *                 message:
 *                   type: string
 *                   example: Perfil de corretor encontrado com sucesso
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', apiKeyMiddleware as any, brokerProfileController.findById.bind(brokerProfileController));

/**
 * @swagger
 * /broker-profiles:
 *   get:
 *     summary: Lista perfis de corretores com filtros
 *     tags: [BrokerProfiles]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/BrokerType'
 *         description: Filtrar por tipo de corretor
 *       - in: query
 *         name: creci_type
 *         schema:
 *           $ref: '#/components/schemas/CreciType'
 *         description: Filtrar por tipo de CRECI
 *       - in: query
 *         name: classification
 *         schema:
 *           type: integer
 *         description: Filtrar por classificação
 *       - in: query
 *         name: region_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por região
 *       - in: query
 *         name: neighborhood_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por bairro
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: include_regions
 *         schema:
 *           type: boolean
 *         description: Se deve incluir as regiões dos corretores
 *       - in: query
 *         name: include_neighborhoods
 *         schema:
 *           type: boolean
 *         description: Se deve incluir os bairros dos corretores
 *       - in: query
 *         name: include_deleted
 *         schema:
 *           type: boolean
 *         description: Se deve incluir perfis removidos
 *     responses:
 *       200:
 *         description: Lista de perfis de corretores
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
 *                     $ref: '#/components/schemas/BrokerProfile'
 *                 message:
 *                   type: string
 *                   example: Perfis de corretores encontrados com sucesso
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', apiKeyMiddleware as any, brokerProfileController.list.bind(brokerProfileController));

/**
 * @swagger
 * /broker-profiles/{id}:
 *   put:
 *     summary: Atualiza um perfil de corretor
 *     tags: [BrokerProfiles]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do perfil de corretor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBrokerProfile'
 *     responses:
 *       200:
 *         description: Perfil de corretor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BrokerProfile'
 *                 message:
 *                   type: string
 *                   example: Perfil de corretor atualizado com sucesso
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', apiKeyMiddleware as any, brokerProfileController.update.bind(brokerProfileController));

/**
 * @swagger
 * /broker-profiles/{id}:
 *   delete:
 *     summary: Remove logicamente um perfil de corretor
 *     tags: [BrokerProfiles]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do perfil de corretor
 *     responses:
 *       200:
 *         description: Perfil de corretor removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BrokerProfile'
 *                 message:
 *                   type: string
 *                   example: Perfil de corretor removido com sucesso
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', apiKeyMiddleware as any, brokerProfileController.softDelete.bind(brokerProfileController));

/**
 * @swagger
 * /broker-profiles/{id}/regions:
 *   put:
 *     summary: Atualiza as regiões de atuação de um corretor
 *     tags: [BrokerProfiles]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do perfil de corretor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRegions'
 *     responses:
 *       200:
 *         description: Regiões atualizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BrokerProfile'
 *                 message:
 *                   type: string
 *                   example: Regiões do corretor atualizadas com sucesso
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id/regions', apiKeyMiddleware as any, brokerProfileController.updateRegions.bind(brokerProfileController));

/**
 * @swagger
 * /broker-profiles/{id}/neighborhoods:
 *   put:
 *     summary: Atualiza os bairros de atuação de um corretor
 *     tags: [BrokerProfiles]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do perfil de corretor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNeighborhoods'
 *     responses:
 *       200:
 *         description: Bairros atualizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BrokerProfile'
 *                 message:
 *                   type: string
 *                   example: Bairros do corretor atualizados com sucesso
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id/neighborhoods', apiKeyMiddleware as any, brokerProfileController.updateNeighborhoods.bind(brokerProfileController));

export default router;
