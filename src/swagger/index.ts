import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

// Função para obter a versão do package.json de forma dinâmica
// Isso funciona tanto em ambiente de desenvolvimento quanto em produção
function getPackageVersion(): string {
  try {
    // Tentar o caminho relativo para desenvolvimento
    const devPath = path.resolve(__dirname, '../../package.json');
    if (fs.existsSync(devPath)) {
      const packageJson = JSON.parse(fs.readFileSync(devPath, 'utf8'));
      return packageJson.version;
    }
    
    // Tentar o caminho relativo para produção
    const prodPath = path.resolve(__dirname, '../package.json');
    if (fs.existsSync(prodPath)) {
      const packageJson = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
      return packageJson.version;
    }
    
    return '1.0.0'; // Versão padrão se não conseguir encontrar
  } catch (error) {
    console.error('Erro ao ler a versão do package.json:', error);
    return '1.0.0';
  }
}

const version = getPackageVersion();

/**
 * Definição completa do Swagger para a API do Sistema Imobiliário
 * Este arquivo configura a documentação Swagger com definições detalhadas
 * de todos os endpoints, schemas, exemplos e respostas padronizadas.
 */

// Definições de schemas para o Swagger
import schemas from './schemas';
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
      url: process.env.NODE_ENV === 'production'
        ? process.env.API_BASE_URL || '/api'
        : '/api',
      description: process.env.NODE_ENV === 'production'
        ? 'Servidor de Produção'
        : 'Servidor de Desenvolvimento Local',
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
  apis: process.env.NODE_ENV === 'production'
    ? [__dirname + '/../routes/*.js']  // Apenas JS em produção
    : [__dirname + '/../routes/*.ts']  // Apenas TS em desenvolvimento
};

// Log dos caminhos sendo escaneados para definições OpenAPI
const scanPath = process.env.NODE_ENV === 'production' ? '*.js' : '*.ts';
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Scanning for OpenAPI definitions: ${scanPath} files`);

// Inicializar swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
