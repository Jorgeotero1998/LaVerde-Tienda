Set-Location $PSScriptRoot + "\.."
if (-not (Test-Path .env)) {
  Copy-Item .env.example .env
  Write-Host "Creado .env desde .env.example" -ForegroundColor Yellow
}
Write-Host "Instalando dependencias Python..." -ForegroundColor Cyan
python -m pip install -r requirements.txt -q
Write-Host "Iniciando backend en http://127.0.0.1:3001 ..." -ForegroundColor Green
python src/app.py
