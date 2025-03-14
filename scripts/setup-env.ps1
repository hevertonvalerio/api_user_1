# Script para configurar os arquivos de ambiente (.env) para diferentes ambientes

# Definindo as cores para melhor visualização
$colorInfo = "Cyan"
$colorSuccess = "Green" 
$colorWarning = "Yellow"
$colorError = "Red"

# Função para gerar um API_KEY aleatório
function Generate-ApiKey {
    $bytes = New-Object Byte[] 32
    $rand = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rand.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

# Verificar se o .env.example existe
if (-not (Test-Path ".env.example")) {
    Write-Host "Arquivo .env.example não encontrado. Este script precisa do arquivo de exemplo para funcionar." -ForegroundColor $colorError
    exit 1
}

# Perguntar o ambiente para o qual se deseja criar o arquivo .env
Write-Host "Qual ambiente você deseja configurar?" -ForegroundColor $colorInfo
Write-Host "1. Desenvolvimento (dev)" 
Write-Host "2. Teste (test)"
Write-Host "3. Produção (prod)"
Write-Host "4. Docker (docker)"

$option = Read-Host "Escolha uma opção (1-4)"

switch ($option) {
    "1" { $env = "dev"; $envFile = ".env.dev" }
    "2" { $env = "test"; $envFile = ".env.test" }
    "3" { $env = "prod"; $envFile = ".env.prod" }
    "4" { $env = "docker"; $envFile = ".env.docker" }
    default {
        Write-Host "Opção inválida. Usando desenvolvimento como padrão." -ForegroundColor $colorWarning
        $env = "dev"; $envFile = ".env.dev"
    }
}

# Verificar se o arquivo já existe e perguntar se deseja sobrescrevê-lo
if (Test-Path $envFile) {
    $overwrite = Read-Host "O arquivo $envFile já existe. Deseja sobrescrevê-lo? (S/N)"
    if ($overwrite -ne "S" -and $overwrite -ne "s") {
        Write-Host "Operação cancelada pelo usuário." -ForegroundColor $colorWarning
        exit 0
    }
}

# Ler o conteúdo do .env.example
$envExample = Get-Content ".env.example" -Raw

# Configurações específicas para cada ambiente
switch ($env) {
    "dev" {
        $port = "3100"
        $apiBaseUrl = "/api"
        $nodeEnv = "development"
        $apiKey = "DEV_API_KEY_$(Generate-ApiKey)"
        $databaseUrl = Read-Host "Digite a URL do banco de dados para desenvolvimento (ou pressione Enter para usar o padrão)"
        if ([string]::IsNullOrWhiteSpace($databaseUrl)) {
            $databaseUrl = "postgresql://postgres:postgres@localhost:5432/cadastro_usuario?schema=public"
        }
    }
    "test" {
        $port = "3101"
        $apiBaseUrl = "/api"
        $nodeEnv = "test"
        $apiKey = "TEST_API_KEY_$(Generate-ApiKey)"
        $databaseUrl = Read-Host "Digite a URL do banco de dados para testes (ou pressione Enter para usar o padrão)"
        if ([string]::IsNullOrWhiteSpace($databaseUrl)) {
            $databaseUrl = "postgresql://postgres:postgres@localhost:5432/cadastro_usuario_test?schema=public"
        }
    }
    "prod" {
        $port = "3100"
        $apiBaseUrl = Read-Host "Digite a URL base da API para produção (ex: https://api.example.com/api)"
        if ([string]::IsNullOrWhiteSpace($apiBaseUrl)) {
            $apiBaseUrl = "/api"
        }
        $nodeEnv = "production"
        $apiKey = "PROD_API_KEY_$(Generate-ApiKey)"
        $databaseUrl = Read-Host "Digite a URL do banco de dados para produção (obrigatório)"
        if ([string]::IsNullOrWhiteSpace($databaseUrl)) {
            Write-Host "A URL do banco de dados é obrigatória para o ambiente de produção." -ForegroundColor $colorError
            exit 1
        }
    }
    "docker" {
        $port = "3100"
        $apiBaseUrl = "/api"
        $nodeEnv = "production"
        $apiKey = "DOCKER_API_KEY_$(Generate-ApiKey)"
        $databaseUrl = Read-Host "Digite a URL do banco de dados para o ambiente Docker (obrigatório)"
        if ([string]::IsNullOrWhiteSpace($databaseUrl)) {
            Write-Host "A URL do banco de dados é obrigatória para o ambiente Docker." -ForegroundColor $colorError
            exit 1
        }
    }
}

# Criar o conteúdo do novo arquivo .env
$newEnvContent = @"
# Server Configuration
PORT=$port
API_BASE_URL=$apiBaseUrl
NODE_ENV=$nodeEnv

# API Security
API_KEY=$apiKey

# Database Configuration
DATABASE_URL="$databaseUrl"
"@

# Salvar o novo arquivo .env
$newEnvContent | Out-File -FilePath $envFile -Encoding utf8

Write-Host "`nArquivo $envFile criado com sucesso!" -ForegroundColor $colorSuccess
Write-Host "`nConteúdo do arquivo:" -ForegroundColor $colorInfo
Write-Host "$newEnvContent"

# Criar também um arquivo .env padrão se solicitado
$createDefault = Read-Host "`nDeseja também definir este como seu arquivo .env padrão? (S/N)"
if ($createDefault -eq "S" -or $createDefault -eq "s") {
    Copy-Item -Path $envFile -Destination ".env" -Force
    Write-Host "Arquivo .env padrão criado com sucesso!" -ForegroundColor $colorSuccess
}

Write-Host "`nConfigurações concluídas para o ambiente $env." -ForegroundColor $colorSuccess
