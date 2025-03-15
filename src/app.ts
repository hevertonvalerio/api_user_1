import express from 'express';
import { config } from './config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import userRoutes from './routes/userRoutes';
import regionRoutes from './routes/regionRoutes';
import neighborhoodRoutes from './routes/neighborhoodRoutes';
import brokerProfileRoutes from './routes/brokerProfileRoutes';
import logger from './utils/logger';

const app = express();

// Middleware para logs de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Middleware para parsing de JSON
app.use(express.json());

// Configuração da base URL da API
const baseUrl = config.api.baseUrl || '/api';

// Rota de verificação de saúde
app.get(`${baseUrl}/health`, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Documentação Swagger em português
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API de Cadastro de Usuários',
  customfavIcon: '/assets/favicon.ico',
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
    docExpansion: 'list',
    filter: true,
    displayRequestDuration: true,
    syntaxHighlight: {
      theme: 'monokai'
    },
    lang: 'pt-BR'
  }
};

// Rota da documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// Rotas da API
app.use(`${baseUrl}/users`, userRoutes);
app.use(`${baseUrl}/regions`, regionRoutes);
app.use(`${baseUrl}/neighborhoods`, neighborhoodRoutes);
app.use(`${baseUrl}/broker-profiles`, brokerProfileRoutes);

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Erro não capturado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: err.message
  });
});

export default app;