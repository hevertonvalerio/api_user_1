#!/bin/bash

# Script para construir, marcar e publicar a imagem Docker no Docker Hub

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "Docker não está instalado. Por favor, instale o Docker antes de continuar."
    exit 1
fi

# Verificar se o usuário está logado no Docker Hub
if ! docker info 2>/dev/null | grep -q "Username"; then
    echo "Você não está logado no Docker Hub. Por favor, execute 'docker login' antes de continuar."
    exit 1
fi

# Definir nome de usuário do Docker Hub
DOCKER_USERNAME="manoelfg123"
echo "Usando nome de usuário do Docker Hub: $DOCKER_USERNAME"

# Definir variáveis
IMAGE_NAME="cadastro-usuario-api"
VERSION=$(node -p "require('./package.json').version")
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
LATEST_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:latest"

echo "=== Iniciando processo de publicação da imagem Docker ==="
echo "Nome da imagem: $FULL_IMAGE_NAME"
echo "Também será marcada como: $LATEST_IMAGE_NAME"

# Construir a imagem
echo -e "\n=== Construindo a imagem Docker ==="
docker build -t $FULL_IMAGE_NAME .

# Verificar se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "Falha ao construir a imagem Docker. Abortando."
    exit 1
fi

# Marcar como latest
echo -e "\n=== Marcando a imagem como latest ==="
docker tag $FULL_IMAGE_NAME $LATEST_IMAGE_NAME

# Enviar para o Docker Hub
echo -e "\n=== Enviando a imagem para o Docker Hub ==="
docker push $FULL_IMAGE_NAME
docker push $LATEST_IMAGE_NAME

# Verificar se o push foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "Falha ao enviar a imagem para o Docker Hub. Verifique sua conexão ou permissões."
    exit 1
fi

echo -e "\n=== Processo de publicação concluído com sucesso ==="
echo "A imagem foi publicada como:"
echo "- $FULL_IMAGE_NAME"
echo "- $LATEST_IMAGE_NAME"
echo -e "\nPara implantar usando Docker Stack, execute:"
echo "DOCKER_USERNAME=$DOCKER_USERNAME docker stack deploy -c docker-compose.yml cadastro-usuario"
