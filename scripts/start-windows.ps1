$ErrorActionPreference = "Stop"

Push-Location (Split-Path -Parent $PSScriptRoot)

Write-Host "Building Prelegal Docker image..."
docker build -t prelegal .

Write-Host "Starting Prelegal..."
docker rm -f prelegal 2>$null
docker run -d -p 8000:8000 --env-file .env --name prelegal prelegal

Write-Host "Prelegal is running at http://localhost:8000"

Pop-Location
