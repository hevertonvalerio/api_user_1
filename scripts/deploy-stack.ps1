# Script para implantar a aplicação usando Docker Stack com configuração Traefik

# Definindo as cores para melhor visualização
$colorInfo = "Cyan"
$colorSuccess = "Green" 
$colorWarning = "Yellow"
$colorError = "Red"

# Verificar se o Docker está instalado e em modo Swarm
try {
    $null = Get-Command docker -ErrorAction Stop
    $swarmStatus = docker info | Select-String -Pattern "Swarm: active"
    
    if (-not $swarmStatus) {
        Write-Host "Docker não está em modo Swarm. Inicializando..." -ForegroundColor $colorWarning
        docker swarm init
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Falha ao inicializar o Docker Swarm. Por favor, inicialize manualmente." -ForegroundColor $colorError
            exit 1
        }
    }
}
catch {
    Write-Host "Docker não está instalado. Por favor, instale o Docker antes de continuar." -ForegroundColor $colorError
    exit 1
}

# Verificar se o usuário está logado no Docker Hub
$dockerInfo = docker info 2>$null
if (-not ($dockerInfo -match "Username")) {
    Write-Host "Você não está logado no Docker Hub. Por favor, execute 'docker login' antes de continuar." -ForegroundColor $colorWarning
    docker login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Falha ao fazer login no Docker Hub. Abortando." -ForegroundColor $colorError
        exit 1
    }
}

# Definir nome de usuário do Docker Hub
$DOCKER_USERNAME = "manoelfg123"
Write-Host "Usando nome de usuário do Docker Hub: $DOCKER_USERNAME" -ForegroundColor $colorInfo

# Verificar se a rede network_public existe
$networkExists = docker network ls | Select-String -Pattern "network_public"
if (-not $networkExists) {
    Write-Host "A rede 'network_public' não existe. Criando..." -ForegroundColor $colorWarning
    docker network create --driver=overlay --attachable network_public
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Falha ao criar a rede 'network_public'. Por favor, verifique as permissões." -ForegroundColor $colorError
        exit 1
    }
}

# Verificar ou criar arquivo de variáveis de ambiente
if (-not (Test-Path ".env.docker")) {
    Write-Host "Arquivo .env.docker não encontrado. Vamos criar um..." -ForegroundColor $colorInfo
    
    # Verificar se o script setup-env.ps1 existe
    if (Test-Path "scripts/setup-env.ps1") {
        Write-Host "Executando script de configuração de ambiente..." -ForegroundColor $colorInfo
        & "scripts/setup-env.ps1"
    } else {
        # Criar arquivo de variáveis manualmente
        $API_KEY = Read-Host "Digite a API_KEY para o ambiente Docker"
        $DATABASE_URL = Read-Host "Digite a URL do banco de dados para o ambiente Docker"
        
        @"
# Server Configuration
PORT=3100
API_BASE_URL=/api
NODE_ENV=production

# API Security
API_KEY=$API_KEY

# Database Configuration
DATABASE_URL="$DATABASE_URL"
"@ | Out-File -FilePath ".env.docker" -Encoding utf8
    }
}

# Carregar variáveis de ambiente do arquivo .env.docker
Get-Content ".env.docker" | ForEach-Object {
    if (-not ($_ -match "^\s*#") -and $_ -match "=") {
        $key, $value = $_ -split "=", 2
        Set-Item -Path "env:$key" -Value $value
    }
}

# Confirmar configurações
Write-Host "`n=== Configurações de Implantação ===" -ForegroundColor $colorInfo
Write-Host "Nome de usuário do Docker Hub: $DOCKER_USERNAME"
Write-Host "Ambiente: $env:NODE_ENV"
Write-Host "Porta da aplicação: $env:PORT"
Write-Host "Domínio: cadastro-usuarios.iaautomation.com.br"
Write-Host "API_KEY: $($env:API_KEY.Substring(0, 5))..." -NoNewline

# Perguntar se deseja construir a imagem antes de implantar
$buildImage = Read-Host "`nDeseja construir e publicar a imagem antes de implantar? (S/N)"
if ($buildImage -eq "S" -or $buildImage -eq "s") {
    # Verificar se o script publish-docker.ps1 existe
    if (Test-Path "scripts/publish-docker.ps1") {
        Write-Host "Executando script de publicação de imagem..." -ForegroundColor $colorInfo
        & "scripts/publish-docker.ps1"
    } else {
        # Construir e publicar a imagem manualmente
        $version = (Get-Content .\package.json | ConvertFrom-Json).version
        $fullImageName = "$DOCKER_USERNAME/cadastro-usuario-api:$version"
        $latestImageName = "$DOCKER_USERNAME/cadastro-usuario-api:latest"
        
        Write-Host "`n=== Construindo a imagem Docker ===" -ForegroundColor $colorInfo
        docker build -t $fullImageName .
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Falha ao construir a imagem Docker. Abortando." -ForegroundColor $colorError
            exit 1
        }
        
        Write-Host "`n=== Marcando a imagem como latest ===" -ForegroundColor $colorInfo
        docker tag $fullImageName $latestImageName
        
        Write-Host "`n=== Enviando a imagem para o Docker Hub ===" -ForegroundColor $colorInfo
        docker push $fullImageName
        docker push $latestImageName
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Falha ao publicar a imagem no Docker Hub. Abortando." -ForegroundColor $colorError
            exit 1
        }
    }
}

# Implantar o stack
Write-Host "`n=== Implantando o stack ===" -ForegroundColor $colorInfo
docker stack deploy -c docker-stack.yaml cadastro-usuario

if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha ao implantar o stack. Verifique os logs para mais detalhes." -ForegroundColor $colorError
    exit 1
}

# Verificar o status do serviço
Start-Sleep -Seconds 5
Write-Host "`n=== Status do serviço ===" -ForegroundColor $colorInfo
docker service ls | Select-String -Pattern "cadastro-usuario"

Write-Host "`n=== Stack implantado com sucesso! ===" -ForegroundColor $colorSuccess
Write-Host "A aplicação estará disponível em: https://cadastro-usuarios.iaautomation.com.br" -ForegroundColor $colorSuccess
Write-Host "`nComandos úteis:" -ForegroundColor $colorInfo
Write-Host "  - Ver logs: docker service logs cadastro-usuario_api" -ForegroundColor $colorInfo
Write-Host "  - Escalar serviço: docker service scale cadastro-usuario_api=N" -ForegroundColor $colorInfo
Write-Host "  - Remover stack: docker stack rm cadastro-usuario" -ForegroundColor $colorInfo
