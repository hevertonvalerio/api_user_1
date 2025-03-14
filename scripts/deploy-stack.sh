#!/bin/bash

# Script para implantar a aplicação usando Docker Stack com configuração Traefik

# Definindo códigos de cores para melhor visualização
COLOR_INFO="\033[0;36m"  # Ciano
COLOR_SUCCESS="\033[0;32m"  # Verde
COLOR_WARNING="\033[0;33m"  # Amarelo
COLOR_ERROR="\033[0;31m"  # Vermelho
COLOR_RESET="\033[0m"  # Reset

# Função para exibir mensagens formatadas
info() {
    echo -e "${COLOR_INFO}$1${COLOR_RESET}"
}

success() {
    echo -e "${COLOR_SUCCESS}$1${COLOR_RESET}"
}

warning() {
    echo -e "${COLOR_WARNING}$1${COLOR_RESET}"
}

error() {
    echo -e "${COLOR_ERROR}$1${COLOR_RESET}"
}

# Verificar se o Docker está instalado e em modo Swarm
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado. Por favor, instale o Docker antes de continuar."
    exit 1
fi

SWARM_STATUS=$(docker info 2>/dev/null | grep "Swarm:" | awk '{print $2}')
if [[ "$SWARM_STATUS" != "active" ]]; then
    warning "Docker não está em modo Swarm. Inicializando..."
    docker swarm init
    
    if [ $? -ne 0 ]; then
        error "Falha ao inicializar o Docker Swarm. Por favor, inicialize manualmente."
        exit 1
    fi
fi

# Verificar se o usuário está logado no Docker Hub
if ! docker info 2>/dev/null | grep -q "Username"; then
    warning "Você não está logado no Docker Hub. Por favor, execute 'docker login' antes de continuar."
    docker login
    
    if [ $? -ne 0 ]; then
        error "Falha ao fazer login no Docker Hub. Abortando."
        exit 1
    fi
fi

# Definir nome de usuário do Docker Hub
DOCKER_USERNAME="manoelfg123"
info "Usando nome de usuário do Docker Hub: $DOCKER_USERNAME"

# Verificar se a rede network_public existe
if ! docker network ls | grep -q "network_public"; then
    warning "A rede 'network_public' não existe. Criando..."
    docker network create --driver=overlay --attachable network_public
    
    if [ $? -ne 0 ]; then
        error "Falha ao criar a rede 'network_public'. Por favor, verifique as permissões."
        exit 1
    fi
fi

# Verificar ou criar arquivo de variáveis de ambiente
if [ ! -f ".env.docker" ]; then
    info "Arquivo .env.docker não encontrado. Vamos criar um..."
    
    # Verificar se o script setup-env.sh existe
    if [ -f "scripts/setup-env.sh" ] && [ -x "scripts/setup-env.sh" ]; then
        info "Executando script de configuração de ambiente..."
        ./scripts/setup-env.sh
    else
        # Criar arquivo de variáveis manualmente
        read -p "Digite a API_KEY para o ambiente Docker: " API_KEY
        read -p "Digite a URL do banco de dados para o ambiente Docker: " DATABASE_URL
        
        cat > .env.docker << EOF
# Server Configuration
PORT=3100
API_BASE_URL=/api
NODE_ENV=production

# API Security
API_KEY=$API_KEY

# Database Configuration
DATABASE_URL="$DATABASE_URL"
EOF
    fi
fi

# Carregar variáveis de ambiente do arquivo .env.docker
export $(grep -v '^#' .env.docker | xargs)

# Confirmar configurações
info "=== Configurações de Implantação ==="
echo "Nome de usuário do Docker Hub: $DOCKER_USERNAME"
echo "Ambiente: $NODE_ENV"
echo "Porta da aplicação: $PORT"
echo "Domínio: cadastro-usuarios.iaautomation.com.br"
echo "API_KEY: ${API_KEY:0:5}..."

# Perguntar se deseja construir a imagem antes de implantar
read -p "Deseja construir e publicar a imagem antes de implantar? (S/N): " BUILD_IMAGE
if [[ "$BUILD_IMAGE" =~ ^[Ss]$ ]]; then
    # Verificar se o script publish-docker.sh existe
    if [ -f "scripts/publish-docker.sh" ] && [ -x "scripts/publish-docker.sh" ]; then
        info "Executando script de publicação de imagem..."
        ./scripts/publish-docker.sh
    else
        # Construir e publicar a imagem manualmente
        VERSION=$(node -p "require('./package.json').version")
        FULL_IMAGE_NAME="$DOCKER_USERNAME/cadastro-usuario-api:$VERSION"
        LATEST_IMAGE_NAME="$DOCKER_USERNAME/cadastro-usuario-api:latest"
        
        info "=== Construindo a imagem Docker ==="
        docker build -t $FULL_IMAGE_NAME .
        
        if [ $? -ne 0 ]; then
            error "Falha ao construir a imagem Docker. Abortando."
            exit 1
        fi
        
        info "=== Marcando a imagem como latest ==="
        docker tag $FULL_IMAGE_NAME $LATEST_IMAGE_NAME
        
        info "=== Enviando a imagem para o Docker Hub ==="
        docker push $FULL_IMAGE_NAME
        docker push $LATEST_IMAGE_NAME
        
        if [ $? -ne 0 ]; then
            error "Falha ao publicar a imagem no Docker Hub. Abortando."
            exit 1
        fi
    fi
fi

# Configurar as variáveis de ambiente para o deploy
export DOCKER_USERNAME API_KEY DATABASE_URL

# Implantar o stack
info "=== Implantando o stack ==="
docker stack deploy -c docker-stack.yaml cadastro-usuario

if [ $? -ne 0 ]; then
    error "Falha ao implantar o stack. Verifique os logs para mais detalhes."
    exit 1
fi

# Verificar o status do serviço
sleep 5
info "=== Status do serviço ==="
docker service ls | grep "cadastro-usuario"

success "=== Stack implantado com sucesso! ==="
success "A aplicação estará disponível em: https://cadastro-usuarios.iaautomation.com.br"
info "Comandos úteis:"
echo "  - Ver logs: docker service logs cadastro-usuario_api"
echo "  - Escalar serviço: docker service scale cadastro-usuario_api=N"
echo "  - Remover stack: docker stack rm cadastro-usuario"
