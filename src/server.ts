import app from './app';
import { config } from './config';
import logger from './utils/logger';

// Get port from environment variables
const PORT = config.server.port;

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
