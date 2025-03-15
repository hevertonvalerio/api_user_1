# Estágio de build
FROM node:20-alpine AS build

# Definindo diretório de trabalho
WORKDIR /app

# Copiando arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalando todas as dependências (incluindo devDependencies)
RUN npm ci

# Copiando código fonte
COPY . .

# Compilando o aplicativo TypeScript
RUN npm run build

# Verificando se os arquivos foram compilados
RUN ls -la dist/ && \
    echo "Verificando arquivos compilados..." && \
    test -f dist/server.js || exit 1

# Removendo dependências de desenvolvimento
RUN npm ci --omit=dev

# Estágio de produção
FROM node:20-alpine AS production

# Criando usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Definindo diretório de trabalho
WORKDIR /app

# Copiando arquivos compilados e dependências do estágio de build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Criando diretório para logs e ajustando permissões
RUN mkdir -p /app/logs && \
    chown -R appuser:appgroup /app

# Alterando para o usuário não-root
USER appuser

# Definindo variáveis de ambiente
ENV NODE_ENV=production \
    PORT=3100

# Expondo a porta da aplicação
EXPOSE ${PORT}

# Verificação de saúde
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --spider -q http://localhost:${PORT}/api/health || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
