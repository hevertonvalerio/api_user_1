# Prompt para Desenvolvimento de API de Usuários - Sistema Imobiliário

## Objetivo
Desenvolver uma API para sistema imobiliário que gerencia usuários, focando especificamente na criação, edição e exclusão lógica de usuários. A API deve ser bem documentada usando Swagger.

## Estrutura do Banco de Dados

### Tabela `users`
- `id` (UUID): Identificador único do usuário
- `name` (VARCHAR): Nome completo do usuário
- `email` (VARCHAR): Email do usuário (único)
- `password` (VARCHAR): Senha do usuário (hash)
- `phone` (VARCHAR): Telefone do usuário
- `user_type_id` (INT): Referência ao tipo de usuário (FK)
- `created_at` (TIMESTAMP): Data de criação
- `updated_at` (TIMESTAMP): Data de última atualização
- `deleted` (BOOLEAN): Flag para exclusão lógica (default: false)
- `deleted_at` (TIMESTAMP): Data de exclusão lógica

### Tabela `user_types`
- `id` (INT): Identificador único do tipo de usuário
- `name` (VARCHAR): Nome do tipo de usuário

## Endpoints API

### 1. Criar Usuário
- **Endpoint**: `POST /api/users`
- **Descrição**: Cria um novo usuário no sistema
- **Campos obrigatórios**: name, email, password, user_type_id
- **Validações**:
  - Email deve ser único
  - Senha deve seguir requisitos mínimos de segurança
  - Tipo de usuário deve existir

### 2. Editar Usuário
- **Endpoint**: `PUT /api/users/{userId}`
- **Descrição**: Atualiza informações de um usuário existente
- **Campos editáveis**: name, email, phone, user_type_id
- **Validações**:
  - Email deve ser único (considerando outros usuários)
  - Tipo de usuário deve existir

### 3. Alterar Senha
- **Endpoint**: `PATCH /api/users/{userId}/password`
- **Descrição**: Atualiza apenas a senha do usuário
- **Campos obrigatórios**: current_password, new_password, confirm_password
- **Validações**:
  - Senha atual deve ser válida
  - Nova senha deve atender requisitos mínimos de segurança
  - Confirmação deve ser igual à nova senha

### 4. Exclusão Lógica de Usuário
- **Endpoint**: `DELETE /api/users/{userId}`
- **Descrição**: NÃO excluir permanentemente o usuário, apenas marcar como excluído
- **Comportamento**:
  - Alterar o campo `deleted` para true
  - Registrar a data atual em `deleted_at`
  - O usuário não deve aparecer em consultas regulares

### 5. Obter Usuário
- **Endpoint**: `GET /api/users`
- **Descrição**: Buscar um usuário por ID, e-mail ou telefone
- **Parâmetros de consulta**: id, email, phone (ao menos um deve ser informado)
- **Comportamento**:
  - Busca exata pelos campos informados
  - Retornar dados completos do usuário incluindo o tipo de usuário
  - Por padrão, usuários marcados como excluídos não devem ser retornados

### 6. Listar Tipos de Usuário
- **Endpoint**: `GET /api/user-types`
- **Descrição**: Lista todos os tipos de usuário disponíveis no sistema
- **Retorno**: Array com id e nome de cada tipo de usuário

## Stack Tecnológica
- **Backend**:
  - Node.js v18+
  - TypeScript
  - Express
  - RabbitMQ para processamento assíncrono
  - Arquitetura MVC (Model-View-Controller)
- **Banco de Dados**:
  - PostgreSQL 14
  - Drizzle ORM para manipulação de dados
  - Drizzle Studio para administração
- **Validação**:
  - Validação de dados de entrada
  - Tratamento de erros padronizado

## Segurança
- API para uso exclusivamente interno (não exposta à internet)
- Autenticação via API KEY no arquivo .env
- Formato do header de autenticação: `X-API-KEY: valor-da-chave`
- Sem necessidade de implementar rate limiting
- Sem necessidade de HTTPS
- Sem necessidade de implementações avançadas contra ataques

## Documentação
- Implementar documentação Swagger completa
- Documentar todos os endpoints com descrições claras
- Incluir exemplos de requisição e resposta
- Documentar todos os códigos de erro possíveis

## Metodologia
- Utilizar o padrão MVC (Model-View-Controller) para organização do código
- Separação clara de responsabilidades entre as camadas
- Models: representação dos dados e regras de negócio
- Views: representação da API e documentação Swagger (sem interface gráfica)
- Controllers: intermediários entre as requisições e os modelos

## Estrutura Sugerida do Projeto (MVC)
```
/src
  /controllers
    UserController.ts
    UserTypeController.ts
  /models
    User.ts
    UserType.ts
  /views
    swagger.json
    responseFormatter.ts
  /middlewares
    ApiKeyMiddleware.ts
    ErrorHandlerMiddleware.ts
  /db
    schema.ts
    client.ts
  /services
    UserService.ts
    UserTypeService.ts
  /repositories
    UserRepository.ts
    UserTypeRepository.ts
  /dtos
    UserDto.ts
    UserTypeDto.ts
  /utils
    hashPassword.ts
    validateEmail.ts
  /config
    index.ts
  app.ts
  server.ts
```

## Entregáveis
- Código fonte completo
- Documentação Swagger
- Scripts de criação do banco de dados
- Instruções de instalação e execução
- Arquivo .env.example com as variáveis necessárias

## Banco de dados
# Postgres
- Url: vps.iaautomation.com.br
- Port: 5432
- User: postgres
- Senha: gZ33eBHvoNJAaXCd90SzYhZ1tehUT386MJe56PsfroixeVZeuk
- default database: users