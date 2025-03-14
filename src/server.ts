import app from './app';
import { config } from './config';
import logger from './utils/logger';

// Iniciar o servidor
app.listen(config.server.port, () => {
  logger.info(`Servidor rodando na porta ${config.server.port}`);
  logger.info(`Documentação Swagger disponível em http://localhost:${config.server.port}/api-docs`);
});
