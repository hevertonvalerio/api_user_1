# Análise Técnica e Descritiva do Projeto "crm_oh_api_cadastro"

**Visão Geral:**

Este projeto é uma API RESTful construída com Node.js, Express.js e TypeScript, utilizando o Drizzle ORM para interação com um banco de dados PostgreSQL. O projeto também inclui documentação Swagger para a API.

**Objetivo:**

A API visa fornecer funcionalidades para um sistema de CRM (Customer Relationship Management) com foco em cadastro de usuários e informações relacionadas a corretores de imóveis, incluindo:

*   Cadastro de Usuários e Tipos de Usuários
*   Gerenciamento de Perfis de Corretores
*   Cadastro e Gerenciamento de Regiões e Bairros
*   Gerenciamento de Equipes e Membros de Equipe

**Estrutura do Projeto:**

O projeto está bem organizado em pastas e arquivos que seguem as convenções de projetos Node.js e Express.js, facilitando a compreensão e manutenção do código. As principais pastas incluem:

*   **`src/`**: Contém todo o código fonte da API, dividido em subpastas por responsabilidade (controllers, routes, services, repositories, etc.).
*   **`drizzle/`**:  Gerencia as migrations e schema do banco de dados PostgreSQL.
*   **`swagger/`**: Configuração para a documentação da API Swagger UI.
*   **`config/`**: Arquivos de configuração da aplicação.
*   **`scripts/`**: Scripts auxiliares para popular o banco de dados e outras tarefas.

**Tecnologias Utilizadas:**

*   **Node.js e Express.js:** Para construir a API RESTful.
*   **TypeScript:** Para adicionar tipagem estática e melhorar a qualidade do código.
*   **Drizzle ORM:** Para abstrair o acesso ao banco de dados PostgreSQL.
*   **PostgreSQL:** Banco de dados relacional utilizado.
*   **Swagger UI:** Para documentação interativa da API.
*   **Winston:** Para logging da aplicação.
*   **Express Validator:** Para validação de requisições.
*   **Bcrypt:** Para hash de senhas.
*   **UUID:** Para geração de IDs únicos.
*   **Dotenv:** Para gerenciamento de variáveis de ambiente.

**Fluxo de Requisição:**

As requisições HTTP são recebidas pelas rotas definidas em `src/routes/`, direcionadas para os controllers em `src/controllers/`, que por sua vez chamam os services em `src/services/` para executar a lógica de negócio. Os services interagem com os repositories em `src/repositories/` para acessar o banco de dados através do Drizzle ORM. Middlewares em `src/middlewares/` são utilizados para tarefas como logging, autenticação e tratamento de erros.

**Como Executar:**

1.  **Configurar Variáveis de Ambiente:** No arquivo `.env`, definir `API_KEY` e `DATABASE_URL` (com as informações do banco PostgreSQL).
2.  **Instalar Dependências:** Executar `npm install`.
3.  **Rodar Migrations:** Executar `npm run db:migrate`.
4.  **Iniciar Servidor:** Executar `npm run dev`.
5.  **Acessar Swagger UI:** Abrir `http://localhost:3001/api-docs` no navegador para visualizar a documentação da API.

**Localização de Arquivos Chave:**

*   **`src/server.ts`**: Ponto de entrada da aplicação, inicia o servidor Express.
*   **`src/app.ts`**: Configuração do Express, middlewares e rotas principais.
*   **`src/routes/`**: Definição de todas as rotas da API.
*   **`src/controllers/`**: Controllers que lidam com as requisições e chamam os services.
*   **`src/services/`**: Lógica de negócio da aplicação.
*   **`src/repositories/`**: Acesso aos dados do banco de dados.
*   **`src/db/schema.ts`**: Definição do schema do banco de dados Drizzle ORM.
*   **`src/swagger/index.ts`**: Configuração do Swagger UI.

Este projeto apresenta uma arquitetura bem estruturada e organizada, seguindo boas práticas de desenvolvimento de APIs RESTful com Node.js, TypeScript e Express.js. A utilização do Drizzle ORM, Swagger e middlewares demonstra a preocupação com a qualidade, manutenibilidade e segurança da API.

Para iniciar o projeto, você pode executar o comando:

\`\`\`bash
npm run dev
\`\`\`

**Importante:**

*   **Protocolo Atual:** HTTP (sem segurança/criptografia).
*   **Suporte HTTPS:** Não configurado por padrão. Necessita implementação adicional.
*   **Formato Padrão:** Não há formato padrão imposto além do uso de HTTP.
*   **A API só aceita requisições HTTP neste momento.**
