import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Real Estate System API',
    version,
    description: 'API for managing users, regions, and neighborhoods in a real estate system',
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
      // Neighborhood schemas
      Neighborhood: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Neighborhood ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          name: {
            type: 'string',
            description: 'Neighborhood name',
            example: 'Downtown',
          },
          city: {
            type: 'string',
            description: 'City name',
            example: 'New York',
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
        },
      },
      CreateNeighborhood: {
        type: 'object',
        required: ['name', 'city'],
        properties: {
          name: {
            type: 'string',
            description: 'Neighborhood name',
            example: 'Downtown',
          },
          city: {
            type: 'string',
            description: 'City name',
            example: 'New York',
          },
        },
      },
      CreateBatchNeighborhood: {
        type: 'object',
        required: ['city', 'neighborhoods'],
        properties: {
          city: {
            type: 'string',
            description: 'City name',
            example: 'New York',
          },
          neighborhoods: {
            type: 'array',
            description: 'List of neighborhood names',
            items: {
              type: 'string',
              example: 'Downtown',
            },
          },
        },
      },
      UpdateNeighborhood: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Neighborhood name',
            example: 'Downtown',
          },
          city: {
            type: 'string',
            description: 'City name',
            example: 'New York',
          },
        },
      },
      NeighborhoodUsage: {
        type: 'object',
        properties: {
          isUsed: {
            type: 'boolean',
            description: 'Whether the neighborhood is being used',
            example: true,
          },
          usedIn: {
            type: 'array',
            description: 'List of modules using the neighborhood',
            items: {
              type: 'string',
              example: 'regions',
            },
          },
        },
      },
      // Region schemas
      Region: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Region ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          name: {
            type: 'string',
            description: 'Region name',
            example: 'North Zone',
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
          neighborhoods: {
            type: 'array',
            description: 'List of neighborhoods in the region',
            items: {
              $ref: '#/components/schemas/Neighborhood',
            },
          },
        },
      },
      CreateRegion: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            description: 'Region name',
            example: 'North Zone',
          },
          neighborhood_ids: {
            type: 'array',
            description: 'List of neighborhood IDs to associate with the region',
            items: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
      },
      UpdateRegion: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Region name',
            example: 'North Zone',
          },
        },
      },
      UpdateRegionNeighborhoods: {
        type: 'object',
        required: ['neighborhood_ids'],
        properties: {
          neighborhood_ids: {
            type: 'array',
            description: 'List of neighborhood IDs to associate with the region',
            items: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
      },
      AddNeighborhoods: {
        type: 'object',
        required: ['neighborhood_ids'],
        properties: {
          neighborhood_ids: {
            type: 'array',
            description: 'List of neighborhood IDs to add to the region',
            items: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
          },
        },
      },
      RegionUsage: {
        type: 'object',
        properties: {
          isUsed: {
            type: 'boolean',
            description: 'Whether the region is being used',
            example: false,
          },
          usedIn: {
            type: 'array',
            description: 'List of modules using the region',
            items: {
              type: 'string',
              example: 'properties',
            },
          },
        },
      },
      // Team schemas
      Team: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Team ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          name: {
            type: 'string',
            description: 'Team name',
            example: 'Sales Team',
          },
          teamType: {
            type: 'string',
            enum: ['Corretores', 'Cadastro', 'Jurídico', 'Atendimento', 'Administrativo'],
            description: 'Team type',
            example: 'Corretores',
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
          members: {
            type: 'array',
            description: 'List of members in the team',
            items: {
              $ref: '#/components/schemas/Member',
            },
          },
        },
      },
      CreateTeam: {
        type: 'object',
        required: ['name', 'teamType'],
        properties: {
          name: {
            type: 'string',
            description: 'Team name',
            example: 'Sales Team',
          },
          teamType: {
            type: 'string',
            enum: ['Corretores', 'Cadastro', 'Jurídico', 'Atendimento', 'Administrativo'],
            description: 'Team type',
            example: 'Corretores',
          },
        },
      },
      UpdateTeam: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Team name',
            example: 'Sales Team',
          },
          teamType: {
            type: 'string',
            enum: ['Corretores', 'Cadastro', 'Jurídico', 'Atendimento', 'Administrativo'],
            description: 'Team type',
            example: 'Corretores',
          },
        },
      },
      SetLeader: {
        type: 'object',
        required: ['member_id'],
        properties: {
          member_id: {
            type: 'string',
            format: 'uuid',
            description: 'Member ID to set as leader',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
      },
      // Member schemas
      Member: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Member ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          name: {
            type: 'string',
            description: 'Member name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Member email',
            example: 'john.doe@example.com',
          },
          phone: {
            type: 'string',
            description: 'Member phone',
            example: '+1234567890',
          },
          isLeader: {
            type: 'boolean',
            description: 'Whether the member is a leader',
            example: false,
          },
          teamId: {
            type: 'string',
            format: 'uuid',
            description: 'Team ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          joinedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Date when the member joined the team',
          },
          active: {
            type: 'boolean',
            description: 'Whether the member is active',
            example: true,
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
          team: {
            $ref: '#/components/schemas/Team',
          },
        },
      },
      CreateMember: {
        type: 'object',
        required: ['name', 'email', 'phone', 'teamId'],
        properties: {
          name: {
            type: 'string',
            description: 'Member name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Member email',
            example: 'john.doe@example.com',
          },
          phone: {
            type: 'string',
            description: 'Member phone',
            example: '+1234567890',
          },
          isLeader: {
            type: 'boolean',
            description: 'Whether the member is a leader',
            example: false,
          },
          teamId: {
            type: 'string',
            format: 'uuid',
            description: 'Team ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
      },
      UpdateMember: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Member name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Member email',
            example: 'john.doe@example.com',
          },
          phone: {
            type: 'string',
            description: 'Member phone',
            example: '+1234567890',
          },
          isLeader: {
            type: 'boolean',
            description: 'Whether the member is a leader',
            example: false,
          },
          teamId: {
            type: 'string',
            format: 'uuid',
            description: 'Team ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        },
      },
      UpdateMemberStatus: {
        type: 'object',
        required: ['active'],
        properties: {
          active: {
            type: 'boolean',
            description: 'Whether the member is active',
            example: true,
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
      ConflictError: {
        description: 'Conflict error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: {
                code: 'CONFLICT',
                message: 'Resource already exists',
              },
            },
          },
        },
      },
      ForbiddenError: {
        description: 'Forbidden error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'Operation not allowed',
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
  apis: [__dirname + '/../routes/*.ts'],
};

// Log the paths being scanned for OpenAPI definitions
console.log('Scanning for OpenAPI definitions in:', options.apis);

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
