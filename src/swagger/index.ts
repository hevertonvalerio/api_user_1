import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

/**
 * Definição completa do Swagger para a API do Sistema Imobiliário
 * Este arquivo configura a documentação Swagger com definições detalhadas
 * de todos os endpoints, schemas, exemplos e respostas padronizadas.
 */

// Definições de schemas para o Swagger
import { schemas } from './schemas';
import { responses } from './responses';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API do Sistema Imobiliário',
    version,
    description: `
      API completa para gerenciamento de usuários, regiões, bairros, equipes e corretores em um sistema imobiliário.
      Esta API fornece endpoints para todas as operações CRUD necessárias para o funcionamento do sistema.
    `,
    contact: {
      name: 'Suporte API',
      email: 'suporte@sistema-imobiliario.com',
      url: 'https://sistema-imobiliario.com/suporte',
    },
    license: {
      name: 'Proprietário',
      url: 'https://sistema-imobiliario.com/licenca',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor da API',
    },
  ],
  tags: [
    {
      name: 'Usuários',
      description: 'Operações relacionadas a usuários do sistema',
    },
    {
      name: 'Tipos de Usuário',
      description: 'Operações relacionadas a tipos de usuário (Admin, Gerente, Corretor, etc.)',
    },
    {
      name: 'Bairros',
      description: 'Operações relacionadas a bairros',
    },
    {
      name: 'Regiões',
      description: 'Operações relacionadas a regiões e suas associações com bairros',
    },
    {
      name: 'Equipes',
      description: 'Operações relacionadas a equipes',
    },
    {
      name: 'Membros',
      description: 'Operações relacionadas a membros de equipes',
    },
    {
      name: 'Perfis de Corretor',
      description: 'Operações relacionadas a perfis de corretores',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
        description: 'Chave de API para autenticação. Deve ser incluída em todas as requisições.',
      },
    },
    schemas,
    responses,
  },
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
};

// Opções para o swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: [__dirname + '/../routes/*.ts'],
};

// Log dos caminhos sendo escaneados para definições OpenAPI
console.log('Scanning for OpenAPI definitions in:', options.apis);

// Inicializar swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
