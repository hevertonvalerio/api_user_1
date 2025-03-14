import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: ['Health Check']
 *     summary: Verifica o status da API
 *     description: Endpoint para monitoramento da saúde do serviço
 *     responses:
 *       200:
 *         description: Serviço está funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2025-03-14T20:49:16.000Z'
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

export default router;
