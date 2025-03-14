# Estágio de build
FROM node:20-alpine AS build

# Definindo diretório de trabalho
WORKDIR /app

# Copiando arquivos de dependências
COPY package*.json ./

# Instalando dependências
RUN npm ci

# Copiando código fonte
COPY . .

# Compilando o aplicativo TypeScript
RUN npm run build

# Removendo dependências de desenvolvimento para produção
RUN npm ci --omit=dev

# Estágio de produção
FROM node:20-alpine AS production

# Definindo diretório de trabalho
WORKDIR /app

# Copiando arquivos compilados e dependências do estágio de build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/drizzle ./drizzle

# Definindo variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3100

# Expondo a porta da aplicação
EXPOSE ${PORT}

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
