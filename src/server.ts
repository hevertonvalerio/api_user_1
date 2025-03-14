import app from './app';
import { config } from './config';
import logger from './utils/logger';

// Define a porta para o servidor
const PORT = 3004; // Alterado para a porta 3004

// Iniciar o servidor
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`); // Mensagem de log atualizada
  logger.info(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`); // Mensagem de log atualizada
});
