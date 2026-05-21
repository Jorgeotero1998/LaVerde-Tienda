Set-Location $PSScriptRoot + "\.."
Write-Host "Instalando dependencias Python..." -ForegroundColor Cyan
python -m pip install -r requirements.txt -q
Write-Host "Iniciando backend en http://127.0.0.1:3001 ..." -ForegroundColor Green
python run_backend.py
