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
 *         region_ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: IDs das regiões
 *       required:
 *         - region_ids
 *     
 *     UpdateNeighborhoods:
 *       type: object
 *       properties:
 *         neighborhood_ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: IDs dos bairros
 *       required:
 *         - neighborhood_ids
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
 *                   example: Broker profile created successfully
 *       404:
 *         description: Região ou bairro não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', apiKeyMiddleware as any, brokerProfileController.createBrokerProfile as any);

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
 *         description: Incluir regiões na resposta
 *       - in: query
 *         name: include_neighborhoods
 *         schema:
 *           type: boolean
 *         description: Incluir bairros na resposta
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
 *                   example: Broker profile retrieved successfully
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', apiKeyMiddleware as any, brokerProfileController.getBrokerProfileById as any);

/**
 * @swagger
 * /broker-profiles:
 *   get:
 *     summary: Lista perfis de corretores com filtros opcionais
 *     tags: [BrokerProfiles]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/BrokerType'
 *         description: Filtro por tipo de corretor
 *       - in: query
 *         name: creci_type
 *         schema:
 *           $ref: '#/components/schemas/CreciType'
 *         description: Filtro por tipo de CRECI
 *       - in: query
 *         name: classification
 *         schema:
 *           type: integer
 *         description: Filtro por classificação
 *       - in: query
 *         name: region_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtro por região
 *       - in: query
 *         name: neighborhood_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtro por bairro
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: include_regions
 *         schema:
 *           type: boolean
 *         description: Incluir regiões na resposta
 *       - in: query
 *         name: include_neighborhoods
 *         schema:
 *           type: boolean
 *         description: Incluir bairros na resposta
 *       - in: query
 *         name: include_deleted
 *         schema:
 *           type: boolean
 *         description: Incluir perfis excluídos logicamente
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
 *                   example: Broker profiles retrieved successfully
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', apiKeyMiddleware as any, brokerProfileController.getBrokerProfiles as any);

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
 *                   example: Broker profile updated successfully
 *       400:
 *         description: Não é possível atualizar um perfil excluído
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', apiKeyMiddleware as any, brokerProfileController.updateBrokerProfile as any);

/**
 * @swagger
 * /broker-profiles/{id}:
 *   delete:
 *     summary: Realiza exclusão lógica de um perfil de corretor
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
 *         description: Perfil de corretor excluído com sucesso
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
 *                   example: Broker profile deleted successfully
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', apiKeyMiddleware as any, brokerProfileController.deleteBrokerProfile as any);

/**
 * @swagger
 * /broker-profiles/{id}/restore:
 *   post:
 *     summary: Restaura um perfil de corretor excluído logicamente
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
 *         description: Perfil de corretor restaurado com sucesso
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
 *                   example: Broker profile restored successfully
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/:id/restore', apiKeyMiddleware as any, brokerProfileController.restoreBrokerProfile as any);

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
 *                 message:
 *                   type: string
 *                   example: Broker profile regions updated successfully
 *       400:
 *         description: Não é possível atualizar regiões de um perfil excluído
 *       404:
 *         description: Perfil de corretor ou região não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id/regions', apiKeyMiddleware as any, brokerProfileController.updateBrokerProfileRegions as any);

/**
 * @swagger
 * /broker-profiles/{id}/regions:
 *   post:
 *     summary: Adiciona regiões a um corretor
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
 *         description: Regiões adicionadas com sucesso
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
 *                   example: Regions added to broker profile successfully
 *       400:
 *         description: Não é possível adicionar regiões a um perfil excluído
 *       404:
 *         description: Perfil de corretor ou região não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/:id/regions', apiKeyMiddleware as any, brokerProfileController.addBrokerProfileRegions as any);

/**
 * @swagger
 * /broker-profiles/{id}/regions/{regionId}:
 *   delete:
 *     summary: Remove uma região específica de um corretor
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
 *       - in: path
 *         name: regionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da região
 *     responses:
 *       200:
 *         description: Região removida com sucesso
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
 *                   example: Region removed from broker profile successfully
 *       400:
 *         description: Não é possível remover região de um perfil excluído
 *       404:
 *         description: Perfil de corretor não encontrado ou região não associada
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id/regions/:regionId', apiKeyMiddleware as any, brokerProfileController.removeBrokerProfileRegion as any);

/**
 * @swagger
 * /broker-profiles/{id}/regions:
 *   get:
 *     summary: Lista todas as regiões de atuação de um corretor
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
 *         description: Lista de regiões
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
 *                   example: Broker profile regions retrieved successfully
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/regions', apiKeyMiddleware as any, brokerProfileController.getBrokerProfileRegions as any);

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
 *                 message:
 *                   type: string
 *                   example: Broker profile neighborhoods updated successfully
 *       400:
 *         description: Não é possível atualizar bairros de um perfil excluído
 *       404:
 *         description: Perfil de corretor ou bairro não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id/neighborhoods', apiKeyMiddleware as any, brokerProfileController.updateBrokerProfileNeighborhoods as any);

/**
 * @swagger
 * /broker-profiles/{id}/neighborhoods:
 *   post:
 *     summary: Adiciona bairros a um corretor
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
 *         description: Bairros adicionados com sucesso
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
 *                   example: Neighborhoods added to broker profile successfully
 *       400:
 *         description: Não é possível adicionar bairros a um perfil excluído
 *       404:
 *         description: Perfil de corretor ou bairro não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/:id/neighborhoods', apiKeyMiddleware as any, brokerProfileController.addBrokerProfileNeighborhoods as any);

/**
 * @swagger
 * /broker-profiles/{id}/neighborhoods/{neighborhoodId}:
 *   delete:
 *     summary: Remove um bairro específico de um corretor
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
 *       - in: path
 *         name: neighborhoodId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do bairro
 *     responses:
 *       200:
 *         description: Bairro removido com sucesso
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
 *                   example: Neighborhood removed from broker profile successfully
 *       400:
 *         description: Não é possível remover bairro de um perfil excluído
 *       404:
 *         description: Perfil de corretor não encontrado ou bairro não associado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id/neighborhoods/:neighborhoodId', apiKeyMiddleware as any, brokerProfileController.removeBrokerProfileNeighborhood as any);

/**
 * @swagger
 * /broker-profiles/{id}/neighborhoods:
 *   get:
 *     summary: Lista todos os bairros de atuação de um corretor
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
 *         description: Lista de bairros
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
 *                   example: Broker profile neighborhoods retrieved successfully
 *       404:
 *         description: Perfil de corretor não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/neighborhoods', apiKeyMiddleware as any, brokerProfileController.getBrokerProfileNeighborhoods as any);

export default router;
