# iniciar-backend.ps1 — correr desde la raíz del proyecto
Set-Location $PSScriptRoot
.\.venv\Scripts\Activate.ps1
$env:FLASK_APP = "src/app.py"
python -m flask run --port=3001
