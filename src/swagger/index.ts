import swaggerJSDoc from 'swagger-jsdoc';
import schemas from './schemas';

// Rotas de Perfil de Corretor
const brokerProfilePaths = {
  '/broker-profiles': {
    post: {
      tags: ['Corretores'],
      summary: 'Criar novo perfil de corretor',
      description: 'Cria um novo perfil de corretor no sistema',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateBrokerProfile',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Perfil de corretor criado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BrokerProfile',
              },
            },
          },
        },
        400: {
          description: 'Dados inválidos fornecidos',
        },
        409: {
          description: 'Email já cadastrado para outro corretor',
        },
        500: {
          description: 'Erro interno do servidor',
        },
      },
    },
    get: {
      tags: ['Corretores'],
      summary: 'Listar perfis de corretor',
      description: 'Retorna a lista de todos os perfis de corretor ativos',
      responses: {
        200: {
          description: 'Lista de perfis de corretor recuperada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/BrokerProfile',
                },
              },
            },
          },
        },
        500: {
          description: 'Erro interno do servidor',
        },
      },
    },
  },
  '/broker-profiles/{id}': {
    get: {
      tags: ['Corretores'],
      summary: 'Buscar perfil de corretor por ID',
      description: 'Retorna os detalhes de um perfil de corretor específico',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do perfil de corretor',
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
      ],
      responses: {
        200: {
          description: 'Perfil de corretor encontrado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BrokerProfile',
              },
            },
          },
        },
        404: {
          description: 'Perfil de corretor não encontrado',
        },
        500: {
          description: 'Erro interno do servidor',
        },
      },
    },
    put: {
      tags: ['Corretores'],
      summary: 'Atualizar perfil de corretor',
      description: 'Atualiza os dados de um perfil de corretor existente',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do perfil de corretor',
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateBrokerProfile',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Perfil de corretor atualizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BrokerProfile',
              },
            },
          },
        },
        400: {
          description: 'Dados inválidos fornecidos',
        },
        404: {
          description: 'Perfil de corretor não encontrado',
        },
        409: {
          description: 'Email já cadastrado para outro corretor',
        },
        500: {
          description: 'Erro interno do servidor',
        },
      },
    },
    delete: {
      tags: ['Corretores'],
      summary: 'Excluir perfil de corretor',
      description: 'Realiza a exclusão lógica de um perfil de corretor',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do perfil de corretor',
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
      ],
      responses: {
        204: {
          description: 'Perfil de corretor excluído com sucesso',
        },
        404: {
          description: 'Perfil de corretor não encontrado',
        },
        500: {
          description: 'Erro interno do servidor',
        },
      },
    },
  },
  '/broker-profiles/{id}/regions': {
    put: {
      tags: ['Regiões'],
      summary: 'Atualizar regiões do corretor',
      description: 'Atualiza a lista de regiões de atuação do corretor',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do perfil de corretor',
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateBrokerRegions',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Regiões atualizadas com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BrokerProfile',
              },
            },
          },
        },
        404: {
          description: 'Perfil de corretor não encontrado',
        },
        500: {
          description: 'Erro interno do servidor',
        },
      },
    },
  },
  '/broker-profiles/{id}/neighborhoods': {
    put: {
      tags: ['Bairros'],
      summary: 'Atualizar bairros do corretor',
      description: 'Atualiza a lista de bairros de atuação do corretor',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do perfil de corretor',
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateBrokerNeighborhoods',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Bairros atualizados com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BrokerProfile',
              },
            },
          },
        },
        404: {
          description: 'Perfil de corretor não encontrado',
        },
        500: {
          description: 'Erro interno do servidor',
        },
      },
    },
  },
};

// Definição base do Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Cadastro de Usuários',
    version: '1.0.0',
    description: 'API para gerenciamento de usuários, corretores, regiões e bairros',
  },
  servers: [
    {
      url: 'http://localhost:3100',
      description: 'Servidor de Desenvolvimento',
    },
    {
      url: 'https://cadastro-usuarios.iaautomation.com.br',
      description: 'Servidor de Produção',
    },
  ],
  tags: [
    {
      name: 'Corretores',
      description: 'Operações relacionadas a perfis de corretores',
    },
    {
      name: 'Regiões',
      description: 'Operações relacionadas a regiões',
    },
    {
      name: 'Bairros',
      description: 'Operações relacionadas a bairros',
    },
  ],
  components: {
    schemas,
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
        description: 'Chave de API para autenticação',
      },
    },
  },
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  paths: {
    ...brokerProfilePaths,
  },
};

// Opções para o swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

export default swaggerJSDoc(options);
