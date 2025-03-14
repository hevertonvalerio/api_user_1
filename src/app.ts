import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/index.js';
import { errorHandlerMiddleware, notFoundHandler } from './middlewares/ErrorHandlerMiddleware';
import { loggerMiddleware } from './middlewares/LoggerMiddleware';
import userRoutes from './routes/userRoutes';
import userTypeRoutes from './routes/userTypeRoutes';
import neighborhoodRoutes from './routes/neighborhoodRoutes';
import regionRoutes from './routes/regionRoutes';
import teamRoutes from './routes/teamRoutes';
import memberRoutes from './routes/memberRoutes';
import brokerProfileRoutes from './routes/brokerProfileRoutes';
import healthRoutes from './routes/healthRoutes';
import logger from './utils/logger';

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Create Express app
const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-types', userTypeRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/broker-profiles', brokerProfileRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandlerMiddleware);

export default app;
