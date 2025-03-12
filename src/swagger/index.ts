import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'User Management API',
    version,
    description: 'API for managing users in a real estate system',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'API server',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
      },
    },
    schemas: {
      UserType: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'User type ID',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'User type name',
            example: 'Admin',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'User ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          name: {
            type: 'string',
            description: 'User name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john.doe@example.com',
          },
          phone: {
            type: 'string',
            description: 'User phone',
            example: '+1234567890',
          },
          userTypeId: {
            type: 'integer',
            description: 'User type ID',
            example: 1,
          },
          userType: {
            $ref: '#/components/schemas/UserType',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date',
          },
          deleted: {
            type: 'boolean',
            description: 'Whether the user is deleted',
            example: false,
          },
          deletedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Deletion date',
            nullable: true,
          },
        },
      },
      CreateUser: {
        type: 'object',
        required: ['name', 'email', 'password', 'userTypeId'],
        properties: {
          name: {
            type: 'string',
            description: 'User name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            description: 'User password',
            example: 'password123',
          },
          phone: {
            type: 'string',
            description: 'User phone',
            example: '+1234567890',
          },
          userTypeId: {
            type: 'integer',
            description: 'User type ID',
            example: 1,
          },
        },
      },
      UpdateUser: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'User name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email',
            example: 'john.doe@example.com',
          },
          phone: {
            type: 'string',
            description: 'User phone',
            example: '+1234567890',
          },
          userTypeId: {
            type: 'integer',
            description: 'User type ID',
            example: 1,
          },
        },
      },
      ChangePassword: {
        type: 'object',
        required: ['currentPassword', 'newPassword', 'confirmPassword'],
        properties: {
          currentPassword: {
            type: 'string',
            description: 'Current password',
            example: 'password123',
          },
          newPassword: {
            type: 'string',
            description: 'New password',
            example: 'newpassword123',
          },
          confirmPassword: {
            type: 'string',
            description: 'Confirm new password',
            example: 'newpassword123',
          },
        },
      },
      Error: {
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
                example: 'Validation failed',
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
                      example: 'Invalid email format',
                    },
                  },
                },
              },
            },
          },
        },
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
          },
          message: {
            type: 'string',
            example: 'Operation successful',
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'API key is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: {
                code: 'UNAUTHORIZED',
                message: 'API key is required',
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: [
                  {
                    field: 'email',
                    message: 'Invalid email format',
                  },
                ],
              },
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: {
                code: 'NOT_FOUND',
                message: 'User not found',
              },
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong',
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.ts'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
