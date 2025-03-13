import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import { errorHandlerMiddleware, notFoundHandler } from './middlewares/ErrorHandlerMiddleware';
import { loggerMiddleware } from './middlewares/LoggerMiddleware';
import userRoutes from './routes/userRoutes';
import userTypeRoutes from './routes/userTypeRoutes';
import neighborhoodRoutes from './routes/neighborhoodRoutes';
import regionRoutes from './routes/regionRoutes';
import logger from './utils/logger';

// Create Express app
const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/user-types', userTypeRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/regions', regionRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandlerMiddleware);

export default app;
