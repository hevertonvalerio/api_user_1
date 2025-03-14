# API de Cadastro de Usuários - Sistema Imobiliário

API RESTful para gerenciamento de usuários em um sistema imobiliário, desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

## Funcionalidades

- Cadastro de usuários
- Edição de dados de usuários
- Alteração de senha
- Exclusão lógica de usuários
- Consulta de usuários por ID, e-mail ou telefone
- Listagem de tipos de usuário
- Gerenciamento de regiões e bairros
- Gerenciamento de equipes e membros
- Gerenciamento de perfis de corretores

## Tecnologias Utilizadas

- **Backend**: Node.js com TypeScript e Express
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Validação**: Express Validator
- **Segurança**: Autenticação via API KEY e hash de senhas com bcrypt
- **Documentação**: Swagger UI
- **Logging**: Winston
- **Containerização**: Docker e Docker Compose

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
/scripts - Scripts utilitários (publicação Docker, configuração de ambiente)
/drizzle - Migrações do banco de dados
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
- Docker e Docker Compose (opcional, para execução em contêiner)

## Instalação e Execução Local

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
   # Linux/macOS
   cp .env.example .env
   # Windows PowerShell
   Copy-Item .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

   Alternativamente, use o script de configuração de ambiente:
   ```powershell
   # Windows PowerShell
   .\scripts\setup-env.ps1
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
   http://localhost:3100/api-docs
   ```

## Execução com Docker

### Construindo e Executando Localmente

1. Construa a imagem Docker:
   ```bash
   docker build -t cadastro-usuario-api .
   ```

2. Execute o contêiner:
   ```bash
   docker run -p 3100:3100 --env-file .env cadastro-usuario-api
   ```

### Usando Docker Compose

1. Configure as variáveis de ambiente:
   ```bash
   # Linux/macOS
   cp .env.example .env.docker
   # Windows PowerShell
   Copy-Item .env.example .env.docker
   # Edite o arquivo .env.docker com suas configurações
   ```

2. Execute com Docker Compose:
   ```bash
   docker-compose up -d
   ```

### Publicação no Docker Hub

Use os scripts fornecidos para publicar a imagem no Docker Hub:

```bash
# Linux/macOS
chmod +x ./scripts/publish-docker.sh
./scripts/publish-docker.sh

# Windows PowerShell
.\scripts\publish-docker.ps1
```

### Implantação com Docker Stack

Para implantar em um ambiente Docker Swarm:

```bash
# Configurar as variáveis de ambiente
export DOCKER_USERNAME=seu-usuario-docker-hub
export API_KEY=sua-chave-api
export DATABASE_URL=sua-url-banco-dados

# Implantar o stack
docker stack deploy -c docker-compose.yml cadastro-usuario
```

## Produção

Para ambiente de produção, compile o código TypeScript:

```bash
npm run build
npm start
```

## Segurança

A API implementa autenticação via API KEY. Todas as requisições devem incluir o header `X-API-KEY` com o valor configurado no arquivo .env.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
