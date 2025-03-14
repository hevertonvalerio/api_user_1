// Definições de respostas padrão para o Swagger

export const responses = {
  UnauthorizedError: {
    description: 'Erro de autenticação - API key ausente ou inválida',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'UNAUTHORIZED',
                },
                message: {
                  type: 'string',
                  example: 'API key é obrigatória',
                },
              },
            },
          },
        },
      },
    },
  },
  
  ConflictError: {
    description: 'Erro de conflito - Recurso já existe',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'CONFLICT',
                },
                message: {
                  type: 'string',
                  example: 'Recurso já existe',
                },
              },
            },
          },
        },
      },
    },
  },
  
  ForbiddenError: {
    description: 'Erro de permissão - Operação não permitida',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'FORBIDDEN',
                },
                message: {
                  type: 'string',
                  example: 'Operação não permitida',
                },
              },
            },
          },
        },
      },
    },
  },
  
  ValidationError: {
    description: 'Erro de validação - Dados inválidos',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Validação falhou',
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string',
                        example: 'email',
                      },
                      message: {
                        type: 'string',
                        example: 'Formato de email inválido',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  
  NotFoundError: {
    description: 'Recurso não encontrado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'NOT_FOUND',
                },
                message: {
                  type: 'string',
                  example: 'Usuário não encontrado',
                },
              },
            },
          },
        },
      },
    },
  },
  
  InternalServerError: {
    description: 'Erro interno do servidor',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'INTERNAL_SERVER_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Algo deu errado',
                },
              },
            },
          },
        },
      },
    },
  },
};
