// Definições de schemas para o Swagger

// Schemas de Tipo de Usuário
const userTypeSchemas = {
  UserType: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único do tipo de usuário',
        example: 1,
      },
      name: {
        type: 'string',
        description: 'Nome do tipo de usuário',
        example: 'Admin',
      },
    },
    required: ['id', 'name'],
    example: {
      id: 1,
      name: 'Admin',
    },
  },
};

// Schemas de Usuário
const userSchemas = {
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID único do usuário (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      name: {
        type: 'string',
        description: 'Nome completo do usuário',
        example: 'João Silva',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário (único no sistema)',
        example: 'joao.silva@exemplo.com',
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do usuário',
        example: '+5511987654321',
        nullable: true,
      },
      userTypeId: {
        type: 'integer',
        description: 'ID do tipo de usuário',
        example: 1,
      },
      userType: {
        $ref: '#/components/schemas/UserType',
        description: 'Detalhes do tipo de usuário',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora de criação do registro',
        example: '2025-03-14T12:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora da última atualização do registro',
        example: '2025-03-14T12:30:00Z',
      },
      deleted: {
        type: 'boolean',
        description: 'Indica se o usuário foi excluído (exclusão lógica)',
        example: false,
      },
      deletedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora da exclusão lógica',
        example: null,
        nullable: true,
      },
    },
    required: ['id', 'name', 'email', 'userTypeId', 'createdAt', 'updatedAt', 'deleted'],
  },
  CreateUser: {
    type: 'object',
    required: ['name', 'email', 'password', 'userTypeId'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome completo do usuário',
        example: 'João Silva',
        minLength: 3,
        maxLength: 255,
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário (único no sistema)',
        example: 'joao.silva@exemplo.com',
        maxLength: 255,
      },
      password: {
        type: 'string',
        description: 'Senha do usuário (será armazenada com hash)',
        example: 'Senha@123',
        minLength: 8,
        maxLength: 255,
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do usuário',
        example: '+5511987654321',
        maxLength: 20,
      },
      userTypeId: {
        type: 'integer',
        description: 'ID do tipo de usuário',
        example: 1,
      },
    },
  },
  UpdateUser: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nome completo do usuário',
        example: 'João Silva Atualizado',
        minLength: 3,
        maxLength: 255,
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário (único no sistema)',
        example: 'joao.silva.atualizado@exemplo.com',
        maxLength: 255,
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do usuário',
        example: '+5511987654322',
        maxLength: 20,
      },
      userTypeId: {
        type: 'integer',
        description: 'ID do tipo de usuário',
        example: 2,
      },
    },
  },
  ChangePassword: {
    type: 'object',
    required: ['currentPassword', 'newPassword', 'confirmPassword'],
    properties: {
      currentPassword: {
        type: 'string',
        description: 'Senha atual do usuário',
        example: 'Senha@123',
        minLength: 8,
        maxLength: 255,
      },
      newPassword: {
        type: 'string',
        description: 'Nova senha do usuário',
        example: 'NovaSenha@123',
        minLength: 8,
        maxLength: 255,
      },
      confirmPassword: {
        type: 'string',
        description: 'Confirmação da nova senha (deve ser igual a newPassword)',
        example: 'NovaSenha@123',
        minLength: 8,
        maxLength: 255,
      },
    },
  },
};

// Schemas de Bairro
const neighborhoodSchemas = {
  Neighborhood: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID único do bairro (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174001',
      },
      name: {
        type: 'string',
        description: 'Nome do bairro',
        example: 'Vila Mariana',
      },
      city: {
        type: 'string',
        description: 'Nome da cidade',
        example: 'São Paulo',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora de criação do registro',
        example: '2025-03-14T12:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora da última atualização do registro',
        example: '2025-03-14T12:30:00Z',
      },
    },
    required: ['id', 'name', 'city', 'createdAt', 'updatedAt'],
  },
  CreateNeighborhood: {
    type: 'object',
    required: ['name', 'city'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome do bairro',
        example: 'Vila Mariana',
        minLength: 2,
        maxLength: 100,
      },
      city: {
        type: 'string',
        description: 'Nome da cidade',
        example: 'São Paulo',
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  CreateBatchNeighborhood: {
    type: 'object',
    required: ['city', 'neighborhoods'],
    properties: {
      city: {
        type: 'string',
        description: 'Nome da cidade para todos os bairros',
        example: 'São Paulo',
        minLength: 2,
        maxLength: 100,
      },
      neighborhoods: {
        type: 'array',
        description: 'Lista de nomes de bairros para criar em lote',
        items: {
          type: 'string',
          example: 'Moema',
          minLength: 2,
          maxLength: 100,
        },
        minItems: 1,
      },
    },
  },
  UpdateNeighborhood: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nome do bairro',
        example: 'Vila Mariana Atualizado',
        minLength: 2,
        maxLength: 100,
      },
      city: {
        type: 'string',
        description: 'Nome da cidade',
        example: 'São Paulo',
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  NeighborhoodUsage: {
    type: 'object',
    properties: {
      isUsed: {
        type: 'boolean',
        description: 'Indica se o bairro está sendo usado',
        example: true,
      },
      usedIn: {
        type: 'array',
        description: 'Lista de módulos que usam o bairro',
        items: {
          type: 'string',
          example: 'regions',
        },
      },
    },
    required: ['isUsed', 'usedIn'],
  },
};

// Schemas de Região
const regionSchemas = {
  Region: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID único da região (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174002',
      },
      name: {
        type: 'string',
        description: 'Nome da região',
        example: 'Zona Sul',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora de criação do registro',
        example: '2025-03-14T12:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora da última atualização do registro',
        example: '2025-03-14T12:30:00Z',
      },
      neighborhoods: {
        type: 'array',
        description: 'Lista de bairros associados à região',
        items: {
          $ref: '#/components/schemas/Neighborhood',
        },
      },
    },
    required: ['id', 'name', 'createdAt', 'updatedAt'],
  },
  CreateRegion: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome da região',
        example: 'Zona Sul',
        minLength: 2,
        maxLength: 100,
      },
      neighborhood_ids: {
        type: 'array',
        description: 'Lista de IDs de bairros para associar à região',
        items: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
      },
    },
  },
  UpdateRegion: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nome da região',
        example: 'Zona Sul Atualizada',
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  UpdateRegionNeighborhoods: {
    type: 'object',
    required: ['neighborhood_ids'],
    properties: {
      neighborhood_ids: {
        type: 'array',
        description: 'Lista completa de IDs de bairros para associar à região (substitui a lista atual)',
        items: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
        minItems: 0,
      },
    },
  },
  AddNeighborhoods: {
    type: 'object',
    required: ['neighborhood_ids'],
    properties: {
      neighborhood_ids: {
        type: 'array',
        description: 'Lista de IDs de bairros para adicionar à região (mantém os existentes)',
        items: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174004',
        },
        minItems: 1,
      },
    },
  },
  RegionUsage: {
    type: 'object',
    properties: {
      isUsed: {
        type: 'boolean',
        description: 'Indica se a região está sendo usada',
        example: false,
      },
      usedIn: {
        type: 'array',
        description: 'Lista de módulos que usam a região',
        items: {
          type: 'string',
          example: 'broker_profiles',
        },
      },
    },
    required: ['isUsed', 'usedIn'],
  },
};

// Schemas de Equipe e Membro
const teamMemberSchemas = {
  Team: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID único da equipe (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174005',
      },
      name: {
        type: 'string',
        description: 'Nome da equipe',
        example: 'Equipe de Vendas',
      },
      teamType: {
        type: 'string',
        enum: ['Corretores', 'Cadastro', 'Jurídico', 'Atendimento', 'Administrativo'],
        description: 'Tipo da equipe',
        example: 'Corretores',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora de criação do registro',
        example: '2025-03-14T12:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora da última atualização do registro',
        example: '2025-03-14T12:30:00Z',
      },
      members: {
        type: 'array',
        description: 'Lista de membros da equipe',
        items: {
          $ref: '#/components/schemas/Member',
        },
      },
    },
    required: ['id', 'name', 'teamType', 'createdAt', 'updatedAt'],
  },
  CreateTeam: {
    type: 'object',
    required: ['name', 'teamType'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome da equipe',
        example: 'Equipe de Vendas',
        minLength: 3,
        maxLength: 100,
      },
      teamType: {
        type: 'string',
        enum: ['Corretores', 'Cadastro', 'Jurídico', 'Atendimento', 'Administrativo'],
        description: 'Tipo da equipe',
        example: 'Corretores',
      },
    },
  },
  UpdateTeam: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nome da equipe',
        example: 'Equipe de Vendas Premium',
        minLength: 3,
        maxLength: 100,
      },
      teamType: {
        type: 'string',
        enum: ['Corretores', 'Cadastro', 'Jurídico', 'Atendimento', 'Administrativo'],
        description: 'Tipo da equipe',
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
        description: 'ID do membro para definir como líder',
        example: '123e4567-e89b-12d3-a456-426614174006',
      },
    },
  },
  Member: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID único do membro (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174006',
      },
      name: {
        type: 'string',
        description: 'Nome do membro',
        example: 'Carlos Oliveira',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do membro (único no sistema)',
        example: 'carlos.oliveira@exemplo.com',
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do membro',
        example: '+5511987654321',
      },
      isLeader: {
        type: 'boolean',
        description: 'Indica se o membro é líder da equipe',
        example: true,
      },
      teamId: {
        type: 'string',
        format: 'uuid',
        description: 'ID da equipe à qual o membro pertence',
        example: '123e4567-e89b-12d3-a456-426614174005',
      },
      joinedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora em que o membro entrou na equipe',
        example: '2025-03-14T12:00:00Z',
      },
      active: {
        type: 'boolean',
        description: 'Indica se o membro está ativo',
        example: true,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora de criação do registro',
        example: '2025-03-14T12:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora da última atualização do registro',
        example: '2025-03-14T12:30:00Z',
      },
      team: {
        $ref: '#/components/schemas/Team',
        description: 'Detalhes da equipe à qual o membro pertence',
      },
    },
    required: ['id', 'name', 'email', 'phone', 'isLeader', 'teamId', 'joinedAt', 'active', 'createdAt', 'updatedAt'],
  },
  CreateMember: {
    type: 'object',
    required: ['name', 'email', 'phone', 'teamId'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome do membro',
        example: 'Carlos Oliveira',
        minLength: 3,
        maxLength: 100,
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do membro (único no sistema)',
        example: 'carlos.oliveira@exemplo.com',
        maxLength: 100,
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do membro',
        example: '+5511987654321',
        minLength: 10,
        maxLength: 20,
      },
      isLeader: {
        type: 'boolean',
        description: 'Indica se o membro é líder da equipe',
        example: true,
      },
      teamId: {
        type: 'string',
        format: 'uuid',
        description: 'ID da equipe à qual o membro pertence',
        example: '123e4567-e89b-12d3-a456-426614174005',
      },
    },
  },
  UpdateMember: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nome do membro',
        example: 'Carlos Oliveira Silva',
        minLength: 3,
        maxLength: 100,
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do membro (único no sistema)',
        example: 'carlos.oliveira.silva@exemplo.com',
        maxLength: 100,
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do membro',
        example: '+5511987654322',
        minLength: 10,
        maxLength: 20,
      },
      isLeader: {
        type: 'boolean',
        description: 'Indica se o membro é líder da equipe',
        example: false,
      },
      teamId: {
        type: 'string',
        format: 'uuid',
        description: 'ID da equipe à qual o membro pertence',
        example: '123e4567-e89b-12d3-a456-426614174007',
      },
    },
  },
  UpdateMemberStatus: {
    type: 'object',
    required: ['active'],
    properties: {
      active: {
        type: 'boolean',
        description: 'Indica se o membro está ativo',
        example: true,
      },
    },
  },
};

// Schemas de Perfil de Corretor
const brokerProfileSchemas = {
  BrokerProfile: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID único do perfil do corretor (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      name: {
        type: 'string',
        description: 'Nome completo do corretor',
        example: 'João Silva',
        minLength: 3,
        maxLength: 255,
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do corretor (único no sistema)',
        example: 'joao.silva@exemplo.com',
        maxLength: 255,
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do corretor',
        example: '+5511987654321',
        maxLength: 20,
      },
      creci: {
        type: 'string',
        description: 'Número do CRECI do corretor',
        example: '123456',
        maxLength: 50,
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'deleted'],
        description: 'Status do corretor no sistema (ativo, inativo ou deletado)',
        example: 'active',
      },
      regions: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Lista de IDs das regiões de atuação do corretor',
        example: ['123e4567-e89b-12d3-a456-426614174001'],
      },
      neighborhoods: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Lista de IDs dos bairros de atuação do corretor',
        example: ['123e4567-e89b-12d3-a456-426614174002'],
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora de criação do registro',
        example: '2025-03-14T12:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora da última atualização do registro',
        example: '2025-03-14T12:30:00Z',
      },
      deletedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data e hora da exclusão lógica',
        example: null,
        nullable: true,
      },
    },
    required: ['id', 'name', 'email', 'phone', 'creci', 'status', 'regions', 'neighborhoods', 'createdAt', 'updatedAt'],
  },
  CreateBrokerProfile: {
    type: 'object',
    required: ['name', 'email', 'phone', 'creci'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome completo do corretor',
        example: 'João Silva',
        minLength: 3,
        maxLength: 255,
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do corretor (único no sistema)',
        example: 'joao.silva@exemplo.com',
        maxLength: 255,
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do corretor',
        example: '+5511987654321',
        maxLength: 20,
      },
      creci: {
        type: 'string',
        description: 'Número do CRECI do corretor',
        example: '123456',
        maxLength: 50,
      },
      regions: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Lista de IDs das regiões de atuação do corretor',
        example: ['123e4567-e89b-12d3-a456-426614174001'],
      },
      neighborhoods: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Lista de IDs dos bairros de atuação do corretor',
        example: ['123e4567-e89b-12d3-a456-426614174002'],
      },
    },
  },
  UpdateBrokerProfile: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nome completo do corretor',
        example: 'João Silva Atualizado',
        minLength: 3,
        maxLength: 255,
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do corretor (único no sistema)',
        example: 'joao.silva.atualizado@exemplo.com',
        maxLength: 255,
      },
      phone: {
        type: 'string',
        description: 'Número de telefone do corretor',
        example: '+5511987654322',
        maxLength: 20,
      },
      creci: {
        type: 'string',
        description: 'Número do CRECI do corretor',
        example: '123457',
        maxLength: 50,
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        description: 'Status do corretor no sistema (ativo ou inativo)',
        example: 'active',
      },
    },
  },
  UpdateBrokerRegions: {
    type: 'object',
    required: ['regions'],
    properties: {
      regions: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Nova lista de IDs das regiões de atuação do corretor',
        example: ['123e4567-e89b-12d3-a456-426614174001'],
      },
    },
  },
  UpdateBrokerNeighborhoods: {
    type: 'object',
    required: ['neighborhoods'],
    properties: {
      neighborhoods: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Nova lista de IDs dos bairros de atuação do corretor',
        example: ['123e4567-e89b-12d3-a456-426614174002'],
      },
    },
  },
};

// Exportar todos os schemas combinados
const schemas = {
  ...userTypeSchemas,
  ...userSchemas,
  ...neighborhoodSchemas,
  ...regionSchemas,
  ...teamMemberSchemas,
  ...brokerProfileSchemas,
};

export default schemas;
