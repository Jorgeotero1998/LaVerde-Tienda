Set-Location $PSScriptRoot + "\..\tienda-frontend"
if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Creado .env desde .env.example" -ForegroundColor Yellow
}
Write-Host "Iniciando frontend en http://localhost:3000 ..." -ForegroundColor Green
npm start
