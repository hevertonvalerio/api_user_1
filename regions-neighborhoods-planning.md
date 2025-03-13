# Planejamento de API para Regiões e Bairros - Sistema Imobiliário

## 1. Estrutura do Banco de Dados

### Tabela `neighborhoods`
- `id` (UUID): Identificador único do bairro
- `name` (VARCHAR): Nome do bairro
- `city` (VARCHAR): Cidade onde o bairro está localizado
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data de última atualização

### Tabela `regions`
- `id` (UUID): Identificador único da região
- `name` (VARCHAR): Nome da região
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data de última atualização

### Tabela `region_neighborhoods` (tabela de junção)
- `region_id` (UUID): Referência à região
- `neighborhood_id` (UUID): Referência ao bairro
- `created_at` (TIMESTAMP): Data de criação

### Restrições e Índices
- Índice único na combinação (`name`, `city`) na tabela `neighborhoods`
- Índice único no `name` da tabela `regions`
- Chaves estrangeiras na tabela `region_neighborhoods` para garantir integridade referencial
- Índice único na combinação (`region_id`, `neighborhood_id`) na tabela `region_neighborhoods`

## 2. Endpoints da API

### 2.1 Bairros (Neighborhoods)

#### 2.1.1 Criar Bairro
- **Endpoint**: `POST /api/neighborhoods`
- **Descrição**: Cria um novo bairro
- **Request Body**:
```json
{
  "name": "string",
  "city": "string"
}
```

#### 2.1.2 Criar Múltiplos Bairros
- **Endpoint**: `POST /api/neighborhoods/batch`
- **Descrição**: Cria múltiplos bairros em lote
- **Request Body**:
```json
{
  "city": "string",
  "neighborhoods": ["string", "string", "string"]
}
```

#### 2.1.3 Obter Bairro por ID
- **Endpoint**: `GET /api/neighborhoods/{neighborhoodId}`
- **Descrição**: Retorna informações de um bairro específico

#### 2.1.4 Listar Bairros
- **Endpoint**: `GET /api/neighborhoods`
- **Descrição**: Lista bairros com filtros opcionais
- **Query Parameters**:
  - `name`: Filtro parcial por nome
  - `city`: Filtro por cidade
  - `page`: Página atual (paginação)
  - `limit`: Itens por página

#### 2.1.5 Atualizar Bairro
- **Endpoint**: `PUT /api/neighborhoods/{neighborhoodId}`
- **Descrição**: Atualiza informações de um bairro
- **Request Body**:
```json
{
  "name": "string",
  "city": "string"
}
```

#### 2.1.6 Excluir Bairro
- **Endpoint**: `DELETE /api/neighborhoods/{neighborhoodId}`
- **Descrição**: Remove um bairro (verificando integridade referencial)

### 2.2 Regiões (Regions)

#### 2.2.1 Criar Região
- **Endpoint**: `POST /api/regions`
- **Descrição**: Cria uma nova região
- **Request Body**:
```json
{
  "name": "string",
  "neighborhood_ids": ["uuid", "uuid", "uuid"]
}
```

#### 2.2.2 Obter Região por ID
- **Endpoint**: `GET /api/regions/{regionId}`
- **Descrição**: Retorna informações de uma região específica com seus bairros

#### 2.2.3 Listar Regiões
- **Endpoint**: `GET /api/regions`
- **Descrição**: Lista regiões com filtros opcionais
- **Query Parameters**:
  - `name`: Filtro parcial por nome
  - `page`: Página atual (paginação)
  - `limit`: Itens por página
  - `include_neighborhoods`: Boolean para incluir bairros na resposta

#### 2.2.4 Atualizar Região
- **Endpoint**: `PUT /api/regions/{regionId}`
- **Descrição**: Atualiza informações de uma região
- **Request Body**:
```json
{
  "name": "string"
}
```

#### 2.2.5 Atualizar Bairros de uma Região
- **Endpoint**: `PUT /api/regions/{regionId}/neighborhoods`
- **Descrição**: Atualiza os bairros associados a uma região
- **Request Body**:
```json
{
  "neighborhood_ids": ["uuid", "uuid", "uuid"]
}
```

#### 2.2.6 Adicionar Bairro a uma Região
- **Endpoint**: `POST /api/regions/{regionId}/neighborhoods`
- **Descrição**: Adiciona um ou mais bairros a uma região existente
- **Request Body**:
```json
{
  "neighborhood_ids": ["uuid", "uuid"]
}
```

#### 2.2.7 Remover Bairro de uma Região
- **Endpoint**: `DELETE /api/regions/{regionId}/neighborhoods/{neighborhoodId}`
- **Descrição**: Remove um bairro específico de uma região

#### 2.2.8 Excluir Região
- **Endpoint**: `DELETE /api/regions/{regionId}`
- **Descrição**: Remove uma região e suas associações com bairros

### 2.3 Verificação de Uso

#### 2.3.1 Verificar Uso de Região
- **Endpoint**: `GET /api/regions/{regionId}/usage`
- **Descrição**: Verifica se uma região está sendo utilizada por outros módulos

#### 2.3.2 Verificar Uso de Bairro
- **Endpoint**: `GET /api/neighborhoods/{neighborhoodId}/usage`
- **Descrição**: Verifica se um bairro está sendo utilizado por regiões ou outros módulos

## 3. Modelagem MVC

### 3.1 Models

#### 3.1.1 Neighborhood Model
```typescript
// src/models/Neighborhood.ts
export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  created_at: Date;
  updated_at: Date;
}
```

#### 3.1.2 Region Model
```typescript
// src/models/Region.ts
export interface Region {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  neighborhoods?: Neighborhood[];
}
```

#### 3.1.3 RegionNeighborhood Model
```typescript
// src/models/RegionNeighborhood.ts
export interface RegionNeighborhood {
  region_id: string;
  neighborhood_id: string;
  created_at: Date;
}
```

### 3.2 Controllers

#### 3.2.1 NeighborhoodController
```typescript
// src/controllers/NeighborhoodController.ts
class NeighborhoodController {
  async create(req: Request, res: Response): Promise<Response> { /* ... */ }
  async createBatch(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findById(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findAll(req: Request, res: Response): Promise<Response> { /* ... */ }
  async update(req: Request, res: Response): Promise<Response> { /* ... */ }
  async delete(req: Request, res: Response): Promise<Response> { /* ... */ }
  async checkUsage(req: Request, res: Response): Promise<Response> { /* ... */ }
}
```

#### 3.2.2 RegionController
```typescript
// src/controllers/RegionController.ts
class RegionController {
  async create(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findById(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findAll(req: Request, res: Response): Promise<Response> { /* ... */ }
  async update(req: Request, res: Response): Promise<Response> { /* ... */ }
  async updateNeighborhoods(req: Request, res: Response): Promise<Response> { /* ... */ }
  async addNeighborhoods(req: Request, res: Response): Promise<Response> { /* ... */ }
  async removeNeighborhood(req: Request, res: Response): Promise<Response> { /* ... */ }
  async delete(req: Request, res: Response): Promise<Response> { /* ... */ }
  async checkUsage(req: Request, res: Response): Promise<Response> { /* ... */ }
}
```

### 3.3 Repositories

#### 3.3.1 NeighborhoodRepository
```typescript
// src/repositories/NeighborhoodRepository.ts
class NeighborhoodRepository {
  async create(data: CreateNeighborhoodDto): Promise<Neighborhood> { /* ... */ }
  async createMany(data: CreateBatchNeighborhoodDto): Promise<Neighborhood[]> { /* ... */ }
  async findById(id: string): Promise<Neighborhood | null> { /* ... */ }
  async findAll(filters: NeighborhoodFilters): Promise<Neighborhood[]> { /* ... */ }
  async update(id: string, data: UpdateNeighborhoodDto): Promise<Neighborhood> { /* ... */ }
  async delete(id: string): Promise<void> { /* ... */ }
  async checkUsage(id: string): Promise<{ isUsed: boolean, usedIn: string[] }> { /* ... */ }
}
```

#### 3.3.2 RegionRepository
```typescript
// src/repositories/RegionRepository.ts
class RegionRepository {
  async create(data: CreateRegionDto): Promise<Region> { /* ... */ }
  async findById(id: string, includeNeighborhoods: boolean = false): Promise<Region | null> { /* ... */ }
  async findAll(filters: RegionFilters): Promise<Region[]> { /* ... */ }
  async update(id: string, data: UpdateRegionDto): Promise<Region> { /* ... */ }
  async updateNeighborhoods(id: string, neighborhoodIds: string[]): Promise<void> { /* ... */ }
  async addNeighborhoods(id: string, neighborhoodIds: string[]): Promise<void> { /* ... */ }
  async removeNeighborhood(regionId: string, neighborhoodId: string): Promise<void> { /* ... */ }
  async delete(id: string): Promise<void> { /* ... */ }
  async checkUsage(id: string): Promise<{ isUsed: boolean, usedIn: string[] }> { /* ... */ }
}
```

### 3.4 DTOs (Data Transfer Objects)

```typescript
// src/dtos/NeighborhoodDto.ts
export interface CreateNeighborhoodDto {
  name: string;
  city: string;
}

export interface CreateBatchNeighborhoodDto {
  city: string;
  neighborhoods: string[];
}

export interface UpdateNeighborhoodDto {
  name?: string;
  city?: string;
}

export interface NeighborhoodFilters {
  name?: string;
  city?: string;
  page?: number;
  limit?: number;
}

// src/dtos/RegionDto.ts
export interface CreateRegionDto {
  name: string;
  neighborhood_ids?: string[];
}

export interface UpdateRegionDto {
  name?: string;
}

export interface UpdateRegionNeighborhoodsDto {
  neighborhood_ids: string[];
}

export interface RegionFilters {
  name?: string;
  page?: number;
  limit?: number;
  include_neighborhoods?: boolean;
}
```

## 4. Banco de Dados (Drizzle ORM)

```typescript
// src/db/schema.ts
import { pgTable, uuid, varchar, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const neighborhoods = pgTable('neighborhoods', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    nameAndCityIndex: uniqueIndex('neighborhoods_name_city_idx').on(table.name, table.city)
  };
});

export const regions = pgTable('regions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const regionNeighborhoods = pgTable('region_neighborhoods', {
  region_id: uuid('region_id').notNull().references(() => regions.id, { onDelete: 'cascade' }),
  neighborhood_id: uuid('neighborhood_id').notNull().references(() => neighborhoods.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.region_id, table.neighborhood_id] })
  };
});
```

## 5. Rotas (Express)

```typescript
// src/routes/neighborhoodRoutes.ts
import { Router } from 'express';
import { NeighborhoodController } from '../controllers/NeighborhoodController';

const neighborhoodRouter = Router();
const neighborhoodController = new NeighborhoodController();

neighborhoodRouter.post('/', neighborhoodController.create);
neighborhoodRouter.post('/batch', neighborhoodController.createBatch);
neighborhoodRouter.get('/:id', neighborhoodController.findById);
neighborhoodRouter.get('/', neighborhoodController.findAll);
neighborhoodRouter.put('/:id', neighborhoodController.update);
neighborhoodRouter.delete('/:id', neighborhoodController.delete);
neighborhoodRouter.get('/:id/usage', neighborhoodController.checkUsage);

export default neighborhoodRouter;

// src/routes/regionRoutes.ts
import { Router } from 'express';
import { RegionController } from '../controllers/RegionController';

const regionRouter = Router();
const regionController = new RegionController();

regionRouter.post('/', regionController.create);
regionRouter.get('/:id', regionController.findById);
regionRouter.get('/', regionController.findAll);
regionRouter.put('/:id', regionController.update);
regionRouter.put('/:id/neighborhoods', regionController.updateNeighborhoods);
regionRouter.post('/:id/neighborhoods', regionController.addNeighborhoods);
regionRouter.delete('/:id/neighborhoods/:neighborhoodId', regionController.removeNeighborhood);
regionRouter.delete('/:id', regionController.delete);
regionRouter.get('/:id/usage', regionController.checkUsage);

export default regionRouter;
```

## 6. Validações e Tratamento de Erros

### 6.1 Validações
- Impedir criação de bairros duplicados (verificação por nome e cidade)
- Impedir criação de regiões com o mesmo nome
- Validar existência de IDs de bairros na criação/atualização de regiões
- Impedir exclusão de bairros que estão associados a regiões (ou fornecer opção de força)

### 6.2 Tratamento de Erros
- Retornar erro 409 (Conflict) para tentativas de cadastro duplicado
- Retornar erro 404 (Not Found) para bairros ou regiões não encontrados
- Retornar erro 400 (Bad Request) para dados de entrada inválidos
- Retornar erro 403 (Forbidden) para tentativas de excluir bairros/regiões em uso por outros módulos

## 7. Swagger Documentation

```yaml
# Apenas seções relevantes do Swagger, para complementar a documentação anterior

components:
  schemas:
    Neighborhood:
      type: object
      properties:
        id:
          type: string
          format: uuid
          readOnly: true
        name:
          type: string
          maxLength: 100
        city:
          type: string
          maxLength: 100
        created_at:
          type: string
          format: date-time
          readOnly: true
        updated_at:
          type: string
          format: date-time
          readOnly: true
      required:
        - name
        - city
        
    Region:
      type: object
      properties:
        id:
          type: string
          format: uuid
          readOnly: true
        name:
          type: string
          maxLength: 100
        created_at:
          type: string
          format: date-time
          readOnly: true
        updated_at:
          type: string
          format: date-time
          readOnly: true
        neighborhoods:
          type: array
          items:
            $ref: '#/components/schemas/Neighborhood'
          readOnly: true
      required:
        - name
        
    CreateNeighborhoodRequest:
      type: object
      properties:
        name:
          type: string
          maxLength: 100
        city:
          type: string
          maxLength: 100
      required:
        - name
        - city
        
    CreateBatchNeighborhoodRequest:
      type: object
      properties:
        city:
          type: string
          maxLength: 100
        neighborhoods:
          type: array
          items:
            type: string
          description: Lista de nomes de bairros para criação em lote
      required:
        - city
        - neighborhoods
        
    CreateRegionRequest:
      type: object
      properties:
        name:
          type: string
          maxLength: 100
        neighborhood_ids:
          type: array
          items:
            type: string
            format: uuid
      required:
        - name
        
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
        
    UsageResponse:
      type: object
      properties:
        isUsed:
          type: boolean
        usedIn:
          type: array
          items:
            type: string
            
# ... Paths seriam adicionados para cada endpoint
```

## 8. Interfaces de Serviço

### 8.1 NeighborhoodService
```typescript
// src/services/NeighborhoodService.ts
class NeighborhoodService {
  private repository: NeighborhoodRepository;
  
  constructor() {
    this.repository = new NeighborhoodRepository();
  }
  
  async create(data: CreateNeighborhoodDto): Promise<Neighborhood> {
    // Validar dados
    // Verificar duplicidade
    // Criar bairro
    return this.repository.create(data);
  }
  
  async createBatch(data: CreateBatchNeighborhoodDto): Promise<Neighborhood[]> {
    // Transformar array de nomes em array de DTOs
    // Verificar duplicidade em massa
    // Criar bairros em batch
    return this.repository.createMany(data);
  }
  
  // ... demais métodos
}
```

### 8.2 RegionService
```typescript
// src/services/RegionService.ts
class RegionService {
  private repository: RegionRepository;
  private neighborhoodRepo: NeighborhoodRepository;
  
  constructor() {
    this.repository = new RegionRepository();
    this.neighborhoodRepo = new NeighborhoodRepository();
  }
  
  async create(data: CreateRegionDto): Promise<Region> {
    // Validar dados
    // Verificar existência dos bairros
    // Criar região e vincular bairros
    const region = await this.repository.create({ name: data.name });
    
    if (data.neighborhood_ids && data.neighborhood_ids.length > 0) {
      await this.repository.addNeighborhoods(region.id, data.neighborhood_ids);
    }
    
    return this.repository.findById(region.id, true);
  }
  
  // ... demais métodos
}
```

## 9. Considerações de Implementação

1. **Transações**: Usar transações do banco de dados para operações que afetam múltiplas tabelas (como criar uma região com bairros)

2. **Cache**: Considerar caching para consultas frequentes de regiões e bairros

3. **Validações**:
   - Implementar validação rigorosa de UUIDs
   - Validar existência de bairros antes de associá-los a regiões
   - Verificar uso de regiões por outros módulos antes de permitir exclusão

4. **Otimizações**:
   - Usar consultas eficientes para listar regiões com seus bairros
   - Implementar paginação em todas as listagens
   - Considerar índices adicionais conforme necessidade

5. **Logs**: Registrar operações de criação, atualização e exclusão para auditoria
