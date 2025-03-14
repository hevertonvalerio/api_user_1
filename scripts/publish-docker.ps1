# Script para construir, marcar e publicar a imagem Docker no Docker Hub para Windows

# Verificar se o Docker está instalado
try {
    $null = Get-Command docker -ErrorAction Stop
}
catch {
    Write-Host "Docker não está instalado. Por favor, instale o Docker antes de continuar." -ForegroundColor Red
    exit 1
}

# Nota: Ignorando verificação de login no Docker Hub, assumindo que o usuário já está logado
Write-Host "Assumindo que o usuário já está logado no Docker Hub..." -ForegroundColor Yellow

# Definir nome de usuário do Docker Hub
$DOCKER_USERNAME = "manoelfg123"
Write-Host "Usando nome de usuário do Docker Hub: $DOCKER_USERNAME" -ForegroundColor Cyan

# Definir variáveis
$IMAGE_NAME = "cadastro-usuario-api"
$VERSION = (Get-Content .\package.json | ConvertFrom-Json).version
$FULL_IMAGE_NAME = "$DOCKER_USERNAME/$IMAGE_NAME`:$VERSION"
$LATEST_IMAGE_NAME = "$DOCKER_USERNAME/$IMAGE_NAME`:latest"

Write-Host "=== Iniciando processo de publicação da imagem Docker ===" -ForegroundColor Cyan
Write-Host "Nome da imagem: $FULL_IMAGE_NAME"
Write-Host "Também será marcada como: $LATEST_IMAGE_NAME"

# Construir a imagem
Write-Host "`n=== Construindo a imagem Docker ===" -ForegroundColor Cyan
docker build -t $FULL_IMAGE_NAME .

# Verificar se o build foi bem-sucedido
if (-not $?) {
    Write-Host "Falha ao construir a imagem Docker. Abortando." -ForegroundColor Red
    exit 1
}

# Marcar como latest
Write-Host "`n=== Marcando a imagem como latest ===" -ForegroundColor Cyan
docker tag $FULL_IMAGE_NAME $LATEST_IMAGE_NAME

# Enviar para o Docker Hub
Write-Host "`n=== Enviando a imagem para o Docker Hub ===" -ForegroundColor Cyan
docker push $FULL_IMAGE_NAME
docker push $LATEST_IMAGE_NAME

# Verificar se o push foi bem-sucedido
if (-not $?) {
    Write-Host "Falha ao enviar a imagem para o Docker Hub. Verifique sua conexão ou permissões." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Processo de publicação concluído com sucesso ===" -ForegroundColor Green
Write-Host "A imagem foi publicada como:"
Write-Host "- $FULL_IMAGE_NAME"
Write-Host "- $LATEST_IMAGE_NAME"
Write-Host "`nPara implantar usando Docker Stack, execute:" -ForegroundColor Yellow
Write-Host "Set-Item -Path Env:DOCKER_USERNAME -Value $DOCKER_USERNAME; docker stack deploy -c docker-compose.yml cadastro-usuario"
