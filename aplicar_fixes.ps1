# aplicar_fixes.ps1 — correr desde la raiz del proyecto
# Solo toca README.md y borra app.py suelto. No toca nada de la app.

Set-Location $PSScriptRoot

# 1. Borrar app.py suelto de la raiz (el real esta en src/app.py)
if (Test-Path "app.py") {
    Remove-Item "app.py"
    Write-Host "✅ app.py de la raiz eliminado" -ForegroundColor Green
}

# 2. Copiar el README corregido
Copy-Item "$PSScriptRoot\README.md" "README.md" -Force
Write-Host "✅ README.md actualizado" -ForegroundColor Green

# 3. Commit y push
git add README.md
git rm --cached app.py 2>$null
git add -A
git commit -m "docs: README corregido + eliminar app.py suelto de raiz"
git push
Write-Host "✅ Cambios subidos a GitHub" -ForegroundColor Green
