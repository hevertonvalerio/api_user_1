# Planejamento de API para Cadastro de Perfil de Corretores - Sistema Imobiliário

## 1. Estrutura do Banco de Dados

### Tabela `broker_profiles`
- `id` (UUID): Identificador único do perfil do corretor
- `type` (ENUM): Tipo do corretor (Locação, Venda, Híbrido)
- `creci` (VARCHAR): Número do registro CRECI
- `creci_type` (ENUM): Tipo do CRECI (Definitivo, Estagiário, Matrícula)
- `classification` (INT): Classificação do corretor (default: 0)
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data de última atualização
- `deleted` (BOOLEAN): Flag para exclusão lógica (default: false)
- `deleted_at` (TIMESTAMP): Data de exclusão lógica (nullable)

### Tabela `broker_regions` (tabela de junção)
- `broker_id` (UUID): Referência ao perfil do corretor
- `region_id` (UUID): Referência à região de atuação
- `created_at` (TIMESTAMP): Data de criação

### Tabela `broker_neighborhoods` (tabela de junção)
- `broker_id` (UUID): Referência ao perfil do corretor
- `neighborhood_id` (UUID): Referência ao bairro de atuação
- `created_at` (TIMESTAMP): Data de criação

### Restrições e Índices
- Chaves estrangeiras na tabela `broker_regions` para garantir integridade referencial
- Chaves estrangeiras na tabela `broker_neighborhoods` para garantir integridade referencial
- Índice único na combinação (`broker_id`, `region_id`) na tabela `broker_regions`
- Índice único na combinação (`broker_id`, `neighborhood_id`) na tabela `broker_neighborhoods`

## 2. Endpoints da API

### 2.1 Perfil de Corretores

#### 2.1.1 Criar Perfil de Corretor
- **Endpoint**: `POST /api/broker-profiles`
- **Descrição**: Cria um novo perfil de corretor
- **Request Body**:
```json
{
  "type": "string", // Enum: "Locação", "Venda", "Híbrido"
  "creci": "string",
  "creci_type": "string", // Enum: "Definitivo", "Estagiário", "Matrícula"
  "classification": 0, // Opcional, default: 0
  "regions": ["uuid", "uuid"], // Array de IDs de regiões (opcional)
  "neighborhoods": ["uuid", "uuid"] // Array de IDs de bairros (opcional)
}
```

#### 2.1.2 Obter Perfil de Corretor por ID
- **Endpoint**: `GET /api/broker-profiles/{brokerId}`
- **Descrição**: Retorna informações de um perfil de corretor específico
- **Query Parameters**:
  - `include_regions`: Boolean para incluir regiões na resposta
  - `include_neighborhoods`: Boolean para incluir bairros na resposta

#### 2.1.3 Listar Perfis de Corretores
- **Endpoint**: `GET /api/broker-profiles`
- **Descrição**: Lista perfis de corretores com filtros opcionais
- **Query Parameters**:
  - `type`: Filtro por tipo de corretor
  - `creci_type`: Filtro por tipo de CRECI
  - `classification`: Filtro por classificação
  - `region_id`: Filtro por região
  - `neighborhood_id`: Filtro por bairro
  - `page`: Página atual (paginação)
  - `limit`: Itens por página
  - `include_regions`: Boolean para incluir regiões na resposta
  - `include_neighborhoods`: Boolean para incluir bairros na resposta
  - `include_deleted`: Boolean para incluir perfis excluídos logicamente

#### 2.1.4 Atualizar Perfil de Corretor
- **Endpoint**: `PUT /api/broker-profiles/{brokerId}`
- **Descrição**: Atualiza informações de um perfil de corretor
- **Request Body**:
```json
{
  "type": "string", // Opcional
  "creci": "string", // Opcional
  "creci_type": "string", // Opcional
  "classification": 0 // Opcional
}
```

#### 2.1.5 Exclusão Lógica de Perfil de Corretor
- **Endpoint**: `DELETE /api/broker-profiles/{brokerId}`
- **Descrição**: Realiza exclusão lógica do perfil de corretor
- **Comportamento**:
  - Altera o campo `deleted` para true
  - Registra a data atual em `deleted_at`
  - O perfil não deve aparecer em consultas regulares

#### 2.1.6 Restaurar Perfil de Corretor
- **Endpoint**: `POST /api/broker-profiles/{brokerId}/restore`
- **Descrição**: Restaura um perfil de corretor excluído logicamente
- **Comportamento**:
  - Altera o campo `deleted` para false
  - Define `deleted_at` como null

### 2.2 Gerenciamento de Regiões do Corretor

#### 2.2.1 Atualizar Regiões do Corretor
- **Endpoint**: `PUT /api/broker-profiles/{brokerId}/regions`
- **Descrição**: Atualiza as regiões de atuação de um corretor
- **Request Body**:
```json
{
  "region_ids": ["uuid", "uuid", "uuid"]
}
```

#### 2.2.2 Adicionar Região ao Corretor
- **Endpoint**: `POST /api/broker-profiles/{brokerId}/regions`
- **Descrição**: Adiciona uma ou mais regiões a um corretor
- **Request Body**:
```json
{
  "region_ids": ["uuid", "uuid"]
}
```

#### 2.2.3 Remover Região do Corretor
- **Endpoint**: `DELETE /api/broker-profiles/{brokerId}/regions/{regionId}`
- **Descrição**: Remove uma região específica de um corretor

#### 2.2.4 Listar Regiões do Corretor
- **Endpoint**: `GET /api/broker-profiles/{brokerId}/regions`
- **Descrição**: Lista todas as regiões de atuação de um corretor

### 2.3 Gerenciamento de Bairros do Corretor

#### 2.3.1 Atualizar Bairros do Corretor
- **Endpoint**: `PUT /api/broker-profiles/{brokerId}/neighborhoods`
- **Descrição**: Atualiza os bairros de atuação de um corretor
- **Request Body**:
```json
{
  "neighborhood_ids": ["uuid", "uuid", "uuid"]
}
```

#### 2.3.2 Adicionar Bairro ao Corretor
- **Endpoint**: `POST /api/broker-profiles/{brokerId}/neighborhoods`
- **Descrição**: Adiciona um ou mais bairros a um corretor
- **Request Body**:
```json
{
  "neighborhood_ids": ["uuid", "uuid"]
}
```

#### 2.3.3 Remover Bairro do Corretor
- **Endpoint**: `DELETE /api/broker-profiles/{brokerId}/neighborhoods/{neighborhoodId}`
- **Descrição**: Remove um bairro específico de um corretor

#### 2.3.4 Listar Bairros do Corretor
- **Endpoint**: `GET /api/broker-profiles/{brokerId}/neighborhoods`
- **Descrição**: Lista todos os bairros de atuação de um corretor

## 3. Modelagem MVC

### 3.1 Models

#### 3.1.1 BrokerProfile Model
```typescript
// src/models/BrokerProfile.ts
export interface BrokerProfile {
  id: string;
  type: BrokerType;
  creci: string;
  creci_type: CreciType;
  classification: number;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  deleted_at: Date | null;
  regions?: Region[];
  neighborhoods?: Neighborhood[];
}

export enum BrokerType {
  LOCACAO = "Locação",
  VENDA = "Venda",
  HIBRIDO = "Híbrido"
}

export enum CreciType {
  DEFINITIVO = "Definitivo",
  ESTAGIARIO = "Estagiário",
  MATRICULA = "Matrícula"
}
```

#### 3.1.2 BrokerRegion Model
```typescript
// src/models/BrokerRegion.ts
export interface BrokerRegion {
  broker_id: string;
  region_id: string;
  created_at: Date;
}
```

#### 3.1.3 BrokerNeighborhood Model
```typescript
// src/models/BrokerNeighborhood.ts
export interface BrokerNeighborhood {
  broker_id: string;
  neighborhood_id: string;
  created_at: Date;
}
```

### 3.2 Controllers

#### 3.2.1 BrokerProfileController
```typescript
// src/controllers/BrokerProfileController.ts
class BrokerProfileController {
  async create(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findById(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findAll(req: Request, res: Response): Promise<Response> { /* ... */ }
  async update(req: Request, res: Response): Promise<Response> { /* ... */ }
  async delete(req: Request, res: Response): Promise<Response> { /* ... */ }
  async restore(req: Request, res: Response): Promise<Response> { /* ... */ }
  
  // Regions
  async updateRegions(req: Request, res: Response): Promise<Response> { /* ... */ }
  async addRegions(req: Request, res: Response): Promise<Response> { /* ... */ }
  async removeRegion(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findRegions(req: Request, res: Response): Promise<Response> { /* ... */ }
  
  // Neighborhoods
  async updateNeighborhoods(req: Request, res: Response): Promise<Response> { /* ... */ }
  async addNeighborhoods(req: Request, res: Response): Promise<Response> { /* ... */ }
  async removeNeighborhood(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findNeighborhoods(req: Request, res: Response): Promise<Response> { /* ... */ }
}
```

### 3.3 Repositories

#### 3.3.1 BrokerProfileRepository
```typescript
// src/repositories/BrokerProfileRepository.ts
class BrokerProfileRepository {
  async create(data: CreateBrokerProfileDto): Promise<BrokerProfile> { /* ... */ }
  async findById(id: string, options: BrokerProfileQueryOptions = {}): Promise<BrokerProfile | null> { /* ... */ }
  async findAll(filters: BrokerProfileFilters): Promise<BrokerProfile[]> { /* ... */ }
  async update(id: string, data: UpdateBrokerProfileDto): Promise<BrokerProfile> { /* ... */ }
  async delete(id: string): Promise<void> { /* ... */ }
  async restore(id: string): Promise<void> { /* ... */ }
  
  // Regions
  async updateRegions(brokerId: string, regionIds: string[]): Promise<void> { /* ... */ }
  async addRegions(brokerId: string, regionIds: string[]): Promise<void> { /* ... */ }
  async removeRegion(brokerId: string, regionId: string): Promise<void> { /* ... */ }
  async findRegions(brokerId: string): Promise<Region[]> { /* ... */ }
  
  // Neighborhoods
  async updateNeighborhoods(brokerId: string, neighborhoodIds: string[]): Promise<void> { /* ... */ }
  async addNeighborhoods(brokerId: string, neighborhoodIds: string[]): Promise<void> { /* ... */ }
  async removeNeighborhood(brokerId: string, neighborhoodId: string): Promise<void> { /* ... */ }
  async findNeighborhoods(brokerId: string): Promise<Neighborhood[]> { /* ... */ }
}
```

### 3.4 DTOs (Data Transfer Objects)

```typescript
// src/dtos/BrokerProfileDto.ts
export interface CreateBrokerProfileDto {
  type: BrokerType;
  creci: string;
  creci_type: CreciType;
  classification?: number;
  regions?: string[];
  neighborhoods?: string[];
}

export interface UpdateBrokerProfileDto {
  type?: BrokerType;
  creci?: string;
  creci_type?: CreciType;
  classification?: number;
}

export interface BrokerProfileFilters {
  type?: BrokerType;
  creci_type?: CreciType;
  classification?: number;
  region_id?: string;
  neighborhood_id?: string;
  page?: number;
  limit?: number;
  include_regions?: boolean;
  include_neighborhoods?: boolean;
  include_deleted?: boolean;
}

export interface BrokerProfileQueryOptions {
  include_regions?: boolean;
  include_neighborhoods?: boolean;
}

export interface UpdateRegionsDto {
  region_ids: string[];
}

export interface UpdateNeighborhoodsDto {
  neighborhood_ids: string[];
}
```

## 4. Banco de Dados (Drizzle ORM)

```typescript
// src/db/schema.ts
import { pgTable, uuid, varchar, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { regions } from './regions_schema';
import { neighborhoods } from './neighborhoods_schema';

export const brokerTypeEnum = pgEnum('broker_type', [
  'Locação',
  'Venda',
  'Híbrido'
]);

export const creciTypeEnum = pgEnum('creci_type', [
  'Definitivo',
  'Estagiário',
  'Matrícula'
]);

export const brokerProfiles = pgTable('broker_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: brokerTypeEnum('type').notNull(),
  creci: varchar('creci', { length: 50 }).notNull(),
  creci_type: creciTypeEnum('creci_type').notNull(),
  classification: integer('classification').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted: boolean('deleted').default(false).notNull(),
  deleted_at: timestamp('deleted_at')
});

export const brokerRegions = pgTable('broker_regions', {
  broker_id: uuid('broker_id').notNull().references(() => brokerProfiles.id, { onDelete: 'cascade' }),
  region_id: uuid('region_id').notNull().references(() => regions.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.broker_id, table.region_id] })
  };
});

export const brokerNeighborhoods = pgTable('broker_neighborhoods', {
  broker_id: uuid('broker_id').notNull().references(() => brokerProfiles.id, { onDelete: 'cascade' }),
  neighborhood_id: uuid('neighborhood_id').notNull().references(() => neighborhoods.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.broker_id, table.neighborhood_id] })
  };
});
```

## 5. Rotas (Express)

```typescript
// src/routes/brokerProfileRoutes.ts
import { Router } from 'express';
import { BrokerProfileController } from '../controllers/BrokerProfileController';
import { apiKeyMiddleware } from '../middlewares/ApiKeyMiddleware';

const brokerProfileRouter = Router();
const brokerProfileController = new BrokerProfileController();

// Aplicar middleware de autenticação em todas as rotas
brokerProfileRouter.use(apiKeyMiddleware);

// Rotas principais de perfil
brokerProfileRouter.post('/', brokerProfileController.create);
brokerProfileRouter.get('/:id', brokerProfileController.findById);
brokerProfileRouter.get('/', brokerProfileController.findAll);
brokerProfileRouter.put('/:id', brokerProfileController.update);
brokerProfileRouter.delete('/:id', brokerProfileController.delete);
brokerProfileRouter.post('/:id/restore', brokerProfileController.restore);

// Rotas de regiões
brokerProfileRouter.put('/:id/regions', brokerProfileController.updateRegions);
brokerProfileRouter.post('/:id/regions', brokerProfileController.addRegions);
brokerProfileRouter.delete('/:id/regions/:regionId', brokerProfileController.removeRegion);
brokerProfileRouter.get('/:id/regions', brokerProfileController.findRegions);

// Rotas de bairros
brokerProfileRouter.put('/:id/neighborhoods', brokerProfileController.updateNeighborhoods);
brokerProfileRouter.post('/:id/neighborhoods', brokerProfileController.addNeighborhoods);
brokerProfileRouter.delete('/:id/neighborhoods/:neighborhoodId', brokerProfileController.removeNeighborhood);
brokerProfileRouter.get('/:id/neighborhoods', brokerProfileController.findNeighborhoods);

export default brokerProfileRouter;
```

## 6. Validações e Tratamento de Erros

### 6.1 Validações
- Validar se os tipos de corretor e CRECI estão dentro dos valores permitidos
- Validar obrigatoriedade dos campos `type`, `creci` e `creci_type`
- Verificar existência dos IDs de regiões e bairros na criação/atualização de associações
- Verificar se o perfil existe e não está excluído logicamente antes de atualizações

### 6.2 Tratamento de Erros
- Retornar erro 404 (Not Found) para perfis de corretores não encontrados
- Retornar erro 400 (Bad Request) para dados de entrada inválidos
- Retornar erro 409 (Conflict) para tentativas de cadastros com conflitos
- Incluir mensagens de erro detalhadas para facilitar o debugging

## 7. Serviços

```typescript
// src/services/BrokerProfileService.ts
class BrokerProfileService {
  private repository: BrokerProfileRepository;
  private regionRepository: RegionRepository;
  private neighborhoodRepository: NeighborhoodRepository;
  
  constructor() {
    this.repository = new BrokerProfileRepository();
    this.regionRepository = new RegionRepository();
    this.neighborhoodRepository = new NeighborhoodRepository();
  }
  
  async create(data: CreateBrokerProfileDto): Promise<BrokerProfile> {
    // Validar dados
    this.validateRequiredFields(data);
    
    // Criar o perfil de corretor
    const brokerProfile = await this.repository.create({
      type: data.type,
      creci: data.creci,
      creci_type: data.creci_type,
      classification: data.classification || 0
    });
    
    // Adicionar regiões se fornecidas
    if (data.regions && data.regions.length > 0) {
      await this.validateRegions(data.regions);
      await this.repository.addRegions(brokerProfile.id, data.regions);
    }
    
    // Adicionar bairros se fornecidos
    if (data.neighborhoods && data.neighborhoods.length > 0) {
      await this.validateNeighborhoods(data.neighborhoods);
      await this.repository.addNeighborhoods(brokerProfile.id, data.neighborhoods);
    }
    
    return this.repository.findById(brokerProfile.id, {
      include_regions: true,
      include_neighborhoods: true
    });
  }
  
  async update(id: string, data: UpdateBrokerProfileDto): Promise<BrokerProfile> {
    // Verificar se o perfil existe
    const existingProfile = await this.repository.findById(id);
    if (!existingProfile) {
      throw new NotFoundException('Perfil de corretor não encontrado');
    }
    if (existingProfile.deleted) {
      throw new BadRequestException('Não é possível atualizar um perfil excluído');
    }
    
    // Atualizar o perfil
    return this.repository.update(id, data);
  }
  
  // Métodos privados para validação
  private validateRequiredFields(data: CreateBrokerProfileDto): void {
    if (!data.type) {
      throw new BadRequestException('O tipo do corretor é obrigatório');
    }
    if (!data.creci) {
      throw new BadRequestException('O número do CRECI é obrigatório');
    }
    if (!data.creci_type) {
      throw new BadRequestException('O tipo do CRECI é obrigatório');
    }
  }
  
  private async validateRegions(regionIds: string[]): Promise<void> {
    // Verificar se todas as regiões existem
    for (const regionId of regionIds) {
      const region = await this.regionRepository.findById(regionId);
      if (!region) {
        throw new BadRequestException(`Região com ID ${regionId} não encontrada`);
      }
    }
  }
  
  private async validateNeighborhoods(neighborhoodIds: string[]): Promise<void> {
    // Verificar se todos os bairros existem
    for (const neighborhoodId of neighborhoodIds) {
      const neighborhood = await this.neighborhoodRepository.findById(neighborhoodId);
      if (!neighborhood) {
        throw new BadRequestException(`Bairro com ID ${neighborhoodId} não encontrado`);
      }
    }
  }
  
  // Outros métodos para gerenciar regiões e bairros...
}
```

## 8. Swagger Documentation

```yaml
components:
  schemas:
    BrokerProfile:
      type: object
      properties:
        id:
          type: string
          format: uuid
          readOnly: true
        type:
          type: string
          enum: ["Locação", "Venda", "Híbrido"]
        creci:
          type: string
        creci_type:
          type: string
          enum: ["Definitivo", "Estagiário", "Matrícula"]
        classification:
          type: integer
          default: 0
        created_at:
          type: string
          format: date-time
          readOnly: true
        updated_at:
          type: string
          format: date-time
          readOnly: true
        deleted:
          type: boolean
          readOnly: true
        deleted_at:
          type: string
          format: date-time
          nullable: true
          readOnly: true
        regions:
          type: array
          items:
            $ref: '#/components/schemas/Region'
          readOnly: true
        neighborhoods:
          type: array
          items:
            $ref: '#/components/schemas/Neighborhood'
          readOnly: true
      required:
        - type
        - creci
        - creci_type
        
    CreateBrokerProfileRequest:
      type: object
      properties:
        type:
          type: string
          enum: ["Locação", "Venda", "Híbrido"]
        creci:
          type: string
        creci_type:
          type: string
          enum: ["Definitivo", "Estagiário", "Matrícula"]
        classification:
          type: integer
          default: 0
        regions:
          type: array
          items:
            type: string
            format: uuid
        neighborhoods:
          type: array
          items:
            type: string
            format: uuid
      required:
        - type
        - creci
        - creci_type
        
    UpdateBrokerProfileRequest:
      type: object
      properties:
        type:
          type: string
          enum: ["Locação", "Venda", "Híbrido"]
        creci:
          type: string
        creci_type:
          type: string
          enum: ["Definitivo", "Estagiário", "Matrícula"]
        classification:
          type: integer
          
    UpdateRegionsRequest:
      type: object
      properties:
        region_ids:
          type: array
          items:
            type: string
            format: uuid
      required:
        - region_ids
        
    UpdateNeighborhoodsRequest:
      type: object
      properties:
        neighborhood_ids:
          type: array
          items:
            type: string
            format: uuid
      required:
        - neighborhood_ids
```

## 9. Considerações de Implementação

1. **Transações**: Utilizar transações do banco de dados para operações que afetam múltiplas tabelas, como criar um perfil com regiões e bairros.

2. **Exclusão Lógica**: Implementar a exclusão lógica conforme solicitado:
   - Ao excluir um perfil, alterar o campo `deleted` para true e registrar a data atual em `deleted_at`
   - Por padrão, não retornar perfis excluídos logicamente nas consultas
   - Adicionar um parâmetro `include_deleted` para permitir consultas de perfis excluídos

3. **Validações**:
   - Validar a obrigatoriedade dos campos marcados como tal
   - Validar os valores para campos enum (type, creci_type)
   - Verificar existência de regiões e bairros ao associá-los

4. **Performance**:
   - Considerar o uso de consultas em batch para adicionar múltiplas regiões ou bairros
   - Implementar paginação para os endpoints de listagem

5. **Segurança**:
   - Seguir o padrão de API KEY para autenticação conforme as APIs anteriores
   - Validar permissões antes de operações sensíveis

6. **Estrutura do Projeto**:
```
/src
  /controllers
    BrokerProfileController.ts
  /models
    BrokerProfile.ts
    BrokerRegion.ts
    BrokerNeighborhood.ts
  /dtos
    BrokerProfileDto.ts
  /repositories
    BrokerProfileRepository.ts
  /services
    BrokerProfileService.ts
  /middlewares
    ApiKeyMiddleware.ts
    ErrorHandlerMiddleware.ts
  /utils
    validators.ts
  /db
    schema.ts
  /routes
    brokerProfileRoutes.ts
  app.ts
  server.ts
```

## 10. Autenticação e Segurança

- Autenticação via API KEY no arquivo .env
- Formato do header de autenticação: `X-API-KEY: valor-da-chave`
- Sem necessidade de implementar rate limiting
- Sem necessidade de HTTPS para ambiente de desenvolvimento
- API para uso exclusivamente interno (não exposta à internet)
