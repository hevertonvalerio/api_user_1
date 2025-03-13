# Planejamento de API para Cadastro de Equipes - Sistema Imobiliário

## 1. Estrutura do Banco de Dados

### Tabela `teams`
- `id` (UUID): Identificador único da equipe
- `name` (VARCHAR): Nome da equipe
- `team_type` (ENUM): Tipo da equipe (Corretores, Cadastro, Jurídico, Atendimento, Administrativo)
- `leader_id` (UUID): Referência ao membro líder (opcional durante criação)
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data de última atualização

### Tabela `members`
- `id` (UUID): Identificador único do membro
- `name` (VARCHAR): Nome completo do membro
- `email` (VARCHAR): Email do membro
- `phone` (VARCHAR): Telefone de contato
- `is_leader` (BOOLEAN): Indica se o membro é líder (0=não, 1=sim)
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data de última atualização

### Tabela `team_members` (tabela de junção)
- `team_id` (UUID): Referência à equipe
- `member_id` (UUID): Referência ao membro
- `joined_at` (TIMESTAMP): Data de entrada na equipe
- `active` (BOOLEAN): Status ativo/inativo do membro na equipe

### Restrições e Índices
- Índice único no `name` da tabela `teams`
- Índice único no `email` da tabela `members`
- Chaves estrangeiras na tabela `team_members` para garantir integridade referencial
- Índice único na combinação (`team_id`, `member_id`) na tabela `team_members`
- Chave estrangeira em `leader_id` na tabela `teams` referenciando `id` na tabela `members`

## 2. Endpoints da API

### 2.1 Equipes (Teams)

#### 2.1.1 Criar Equipe
- **Endpoint**: `POST /api/teams`
- **Descrição**: Cria uma nova equipe
- **Request Body**:
```json
{
  "name": "string",
  "team_type": "string" // Enum: "Corretores", "Cadastro", "Jurídico", "Atendimento", "Administrativo"
}
```

#### 2.1.2 Obter Equipe por ID
- **Endpoint**: `GET /api/teams/{teamId}`
- **Descrição**: Retorna informações de uma equipe específica
- **Query Parameters**:
  - `include_members`: Boolean para incluir membros na resposta

#### 2.1.3 Listar Equipes
- **Endpoint**: `GET /api/teams`
- **Descrição**: Lista equipes com filtros opcionais
- **Query Parameters**:
  - `name`: Filtro parcial por nome
  - `team_type`: Filtro por tipo de equipe
  - `page`: Página atual (paginação)
  - `limit`: Itens por página
  - `include_members`: Boolean para incluir membros na resposta

#### 2.1.4 Atualizar Equipe
- **Endpoint**: `PUT /api/teams/{teamId}`
- **Descrição**: Atualiza informações de uma equipe
- **Request Body**:
```json
{
  "name": "string",
  "team_type": "string"
}
```

#### 2.1.5 Definir Líder da Equipe
- **Endpoint**: `PUT /api/teams/{teamId}/leader`
- **Descrição**: Define um membro como líder da equipe
- **Request Body**:
```json
{
  "member_id": "uuid"
}
```

#### 2.1.6 Excluir Equipe
- **Endpoint**: `DELETE /api/teams/{teamId}`
- **Descrição**: Remove uma equipe e suas associações com membros

### 2.2 Membros (Members)

#### 2.2.1 Criar Membro
- **Endpoint**: `POST /api/members`
- **Descrição**: Cria um novo membro
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "is_leader": boolean
}
```

#### 2.2.2 Obter Membro por ID
- **Endpoint**: `GET /api/members/{memberId}`
- **Descrição**: Retorna informações de um membro específico

#### 2.2.3 Listar Membros
- **Endpoint**: `GET /api/members`
- **Descrição**: Lista membros com filtros opcionais
- **Query Parameters**:
  - `name`: Filtro parcial por nome
  - `email`: Filtro parcial por email
  - `is_leader`: Filtro por status de liderança
  - `page`: Página atual (paginação)
  - `limit`: Itens por página

#### 2.2.4 Atualizar Membro
- **Endpoint**: `PUT /api/members/{memberId}`
- **Descrição**: Atualiza informações de um membro
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "is_leader": boolean
}
```

#### 2.2.5 Excluir Membro
- **Endpoint**: `DELETE /api/members/{memberId}`
- **Descrição**: Remove um membro (verificando integridade referencial)

### 2.3 Associação Equipe-Membro

#### 2.3.1 Adicionar Membros à Equipe
- **Endpoint**: `POST /api/teams/{teamId}/members`
- **Descrição**: Adiciona um ou mais membros a uma equipe
- **Request Body**:
```json
{
  "member_ids": ["uuid", "uuid"]
}
```

#### 2.3.2 Remover Membro da Equipe
- **Endpoint**: `DELETE /api/teams/{teamId}/members/{memberId}`
- **Descrição**: Remove um membro específico de uma equipe

#### 2.3.3 Atualizar Status do Membro na Equipe
- **Endpoint**: `PATCH /api/teams/{teamId}/members/{memberId}`
- **Descrição**: Atualiza o status de um membro na equipe (ativo/inativo)
- **Request Body**:
```json
{
  "active": boolean
}
```

#### 2.3.4 Listar Membros de uma Equipe
- **Endpoint**: `GET /api/teams/{teamId}/members`
- **Descrição**: Lista todos os membros de uma equipe específica
- **Query Parameters**:
  - `active`: Filtro por status ativo/inativo
  - `is_leader`: Filtro por status de liderança
  - `page`: Página atual (paginação)
  - `limit`: Itens por página

#### 2.3.5 Listar Equipes de um Membro
- **Endpoint**: `GET /api/members/{memberId}/teams`
- **Descrição**: Lista todas as equipes às quais um membro pertence
- **Query Parameters**:
  - `active`: Filtro por status ativo/inativo
  - `page`: Página atual (paginação)
  - `limit`: Itens por página

## 3. Modelagem MVC

### 3.1 Models

#### 3.1.1 Team Model
```typescript
// src/models/Team.ts
export interface Team {
  id: string;
  name: string;
  team_type: TeamType;
  leader_id: string | null;
  created_at: Date;
  updated_at: Date;
  members?: Member[];
  leader?: Member;
}

export enum TeamType {
  CORRETORES = "Corretores",
  CADASTRO = "Cadastro",
  JURIDICO = "Jurídico",
  ATENDIMENTO = "Atendimento",
  ADMINISTRATIVO = "Administrativo"
}
```

#### 3.1.2 Member Model
```typescript
// src/models/Member.ts
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_leader: boolean;
  created_at: Date;
  updated_at: Date;
  teams?: Team[];
}
```

#### 3.1.3 TeamMember Model
```typescript
// src/models/TeamMember.ts
export interface TeamMember {
  team_id: string;
  member_id: string;
  joined_at: Date;
  active: boolean;
}
```

### 3.2 Controllers

#### 3.2.1 TeamController
```typescript
// src/controllers/TeamController.ts
class TeamController {
  async create(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findById(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findAll(req: Request, res: Response): Promise<Response> { /* ... */ }
  async update(req: Request, res: Response): Promise<Response> { /* ... */ }
  async setLeader(req: Request, res: Response): Promise<Response> { /* ... */ }
  async delete(req: Request, res: Response): Promise<Response> { /* ... */ }
  async addMembers(req: Request, res: Response): Promise<Response> { /* ... */ }
  async removeMember(req: Request, res: Response): Promise<Response> { /* ... */ }
  async updateMemberStatus(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findMembers(req: Request, res: Response): Promise<Response> { /* ... */ }
}
```

#### 3.2.2 MemberController
```typescript
// src/controllers/MemberController.ts
class MemberController {
  async create(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findById(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findAll(req: Request, res: Response): Promise<Response> { /* ... */ }
  async update(req: Request, res: Response): Promise<Response> { /* ... */ }
  async delete(req: Request, res: Response): Promise<Response> { /* ... */ }
  async findTeams(req: Request, res: Response): Promise<Response> { /* ... */ }
}
```

### 3.3 Repositories

#### 3.3.1 TeamRepository
```typescript
// src/repositories/TeamRepository.ts
class TeamRepository {
  async create(data: CreateTeamDto): Promise<Team> { /* ... */ }
  async findById(id: string, includeMembers: boolean = false): Promise<Team | null> { /* ... */ }
  async findAll(filters: TeamFilters): Promise<Team[]> { /* ... */ }
  async update(id: string, data: UpdateTeamDto): Promise<Team> { /* ... */ }
  async setLeader(id: string, memberId: string): Promise<Team> { /* ... */ }
  async delete(id: string): Promise<void> { /* ... */ }
  async addMembers(teamId: string, memberIds: string[]): Promise<void> { /* ... */ }
  async removeMember(teamId: string, memberId: string): Promise<void> { /* ... */ }
  async updateMemberStatus(teamId: string, memberId: string, active: boolean): Promise<void> { /* ... */ }
  async findMembers(teamId: string, filters: TeamMemberFilters): Promise<Member[]> { /* ... */ }
}
```

#### 3.3.2 MemberRepository
```typescript
// src/repositories/MemberRepository.ts
class MemberRepository {
  async create(data: CreateMemberDto): Promise<Member> { /* ... */ }
  async findById(id: string): Promise<Member | null> { /* ... */ }
  async findAll(filters: MemberFilters): Promise<Member[]> { /* ... */ }
  async update(id: string, data: UpdateMemberDto): Promise<Member> { /* ... */ }
  async delete(id: string): Promise<void> { /* ... */ }
  async findTeams(memberId: string, filters: MemberTeamFilters): Promise<Team[]> { /* ... */ }
}
```

### 3.4 DTOs (Data Transfer Objects)

```typescript
// src/dtos/TeamDto.ts
export interface CreateTeamDto {
  name: string;
  team_type: TeamType;
}

export interface UpdateTeamDto {
  name?: string;
  team_type?: TeamType;
}

export interface SetLeaderDto {
  member_id: string;
}

export interface TeamFilters {
  name?: string;
  team_type?: TeamType;
  page?: number;
  limit?: number;
  include_members?: boolean;
}

export interface AddMembersDto {
  member_ids: string[];
}

export interface TeamMemberFilters {
  active?: boolean;
  is_leader?: boolean;
  page?: number;
  limit?: number;
}

// src/dtos/MemberDto.ts
export interface CreateMemberDto {
  name: string;
  email: string;
  phone: string;
  is_leader: boolean;
}

export interface UpdateMemberDto {
  name?: string;
  email?: string;
  phone?: string;
  is_leader?: boolean;
}

export interface MemberFilters {
  name?: string;
  email?: string;
  is_leader?: boolean;
  page?: number;
  limit?: number;
}

export interface MemberTeamFilters {
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface UpdateTeamMemberStatusDto {
  active: boolean;
}
```

## 4. Banco de Dados (Drizzle ORM)

```typescript
// src/db/schema.ts
import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const teamTypeEnum = pgEnum('team_type', [
  'Corretores',
  'Cadastro',
  'Jurídico',
  'Atendimento',
  'Administrativo'
]);

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  team_type: teamTypeEnum('team_type').notNull(),
  leader_id: uuid('leader_id').references(() => members.id, { onDelete: 'set null' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  is_leader: boolean('is_leader').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const teamMembers = pgTable('team_members', {
  team_id: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  member_id: uuid('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  joined_at: timestamp('joined_at').defaultNow().notNull(),
  active: boolean('active').