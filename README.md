# API de Cadastro de Usuários - Sistema Imobiliário

API RESTful para gerenciamento de usuários em um sistema imobiliário, desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

## Funcionalidades

- Cadastro de usuários
- Edição de dados de usuários
- Alteração de senha
- Exclusão lógica de usuários
- Consulta de usuários por ID, e-mail ou telefone
- Listagem de tipos de usuário

## Tecnologias Utilizadas

- **Backend**: Node.js com TypeScript e Express
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Validação**: Express Validator
- **Segurança**: Autenticação via API KEY e hash de senhas com bcrypt
- **Documentação**: Swagger UI
- **Logging**: Winston

## Estrutura do Projeto

O projeto segue a arquitetura MVC:

```
/src
  /controllers - Controladores para manipulação das requisições
  /middlewares - Middlewares para processamento de requisições
  /db - Configuração e esquema do banco de dados
  /services - Lógica de negócio
  /repositories - Acesso ao banco de dados
  /dtos - Objetos de transferência de dados
  /utils - Utilitários como hash de senha e validação
  /config - Configurações da aplicação
  /swagger - Documentação da API
  /routes - Rotas da API
  app.ts - Configuração do Express
  server.ts - Inicialização do servidor
```

## Endpoints

### Usuários

- `POST /api/users` - Criar um novo usuário
- `PUT /api/users/{userId}` - Atualizar um usuário existente
- `PATCH /api/users/{userId}/password` - Alterar a senha de um usuário
- `DELETE /api/users/{userId}` - Excluir logicamente um usuário
- `GET /api/users?id=&email=&phone=` - Buscar um usuário por ID, e-mail ou telefone

### Tipos de Usuário

- `GET /api/user-types` - Listar todos os tipos de usuário

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/api-cadastro-usuarios.git
   cd api-cadastro-usuarios
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Execute as migrações do banco de dados:
   ```bash
   npm run db:migrate
   ```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

6. Acesse a documentação Swagger:
   ```
   http://localhost:3000/api-docs
   ```

## Segurança

A API implementa autenticação via API KEY. Todas as requisições devem incluir o header `X-API-KEY` com o valor configurado no arquivo .env.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
