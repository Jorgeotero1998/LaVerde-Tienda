# Reporte de archivos/directorios sugeridos para limpieza

_Auditoría generada al 23/05/2026 por Copilot_  
**Repositorio:** https://github.com/Jorgeotero1998/LaVerde-Tienda

## Archivos y carpetas sugeridas para eliminar o mover

**Comunes en proyectos Flask + React:**

- instance/ (si contiene solo DBs temporales locales)
- *.db o archivos de base de datos temporales
- *.log (logs temporales)
- __pycache__/ y cualquier subcarpeta cacheada de Python
- .venv/, venv/, env/ (entornos virtuales locales)
- node_modules/ (carpeta de dependencias Node)
- .env (archivos .env locales con secrets reales)
- .DS_Store, Thumbs.db, desktop.ini, Icon? (archivos del sistema operativo)
- build/, dist/, coverage/, *egg-info/, out/ (salidas de build y coverage)
- yarn-error.log, npm-debug.log
- Archivos de prueba/experimentación fuera de src/ o tienda-frontend/src
- Backups y archivos sueltos: *.bak, *.swp, *.tmp...

## Encontrados en tu estructura

- `instance/`
  - El contenido de instance/ (por ejemplo, bases de datos SQLite) debe estar excluido en producción.

- `*.db`
  - Si tienes archivos .db asociados a pruebas o desarrollo, bórralos/exclúyelos del repo.

- `*.log`, `*.tmp`
  - Busca y limpia cualquier log o temporales en raíz, src/, tienda-frontend/....

- `__pycache__/`, `.venv/`, `node_modules/`, `.env`
  - Verifica que estén incluidos en el .gitignore y no subidos.

- `.env` y equivalentes
  - Elimina todo archivo .env real del repo (solo deja .env.example)

- `.DS_Store`, `Thumbs.db`
  - Archivos autogenerados por Windows/Mac, pueden eliminarse siempre.

---

**Recomendación final:**
- Ejecuta un git status y revisa manualmente todos los archivos listados en este reporte y tu .gitignore.
- Borra cualquier archivo no esencial que cumpla alguna de las características de arriba y no se deba compartir.
- Si accidentalmente un archivo sensible fue subido, considera limpiarlo del historial con git filter-repo o BFG Repo-Cleaner.

_Si tienes dudas sobre algún archivo específico de tu repo, puedes consultarlo aquí._
