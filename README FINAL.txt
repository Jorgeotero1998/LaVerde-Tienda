# 🌿 La Verde — Instrucciones para el equipo

## 🌐 Links de producción (ya deployado, siempre disponible)

| | URL |
|---|---|
| **Frontend (la app)** | https://laverde-frontend.onrender.com |
| **Backend (API)** | https://laverde-backend.onrender.com/api/hello |
| **Panel Admin** | https://laverde-backend.onrender.com/admin |

---

## 👤 Credenciales admin

| | |
|---|---|
| **Email** | admin@laverde.com |
| **Contraseña** | admin1234 |

> ⚠️ No compartas estas credenciales fuera del equipo.

---

## 🧪 Cómo probar la app en producción

1. Entrás a https://laverde-frontend.onrender.com
2. Podés registrarte como usuario nuevo o loguearte con el admin
3. Navegás el catálogo, agregás al carrito, favoritos y hacés pedidos

> ⚠️ **La primera vez que abrís la página puede tardar 30-60 segundos** en cargar porque Render apaga los servicios gratuitos cuando no se usan. Es normal, esperá y recargá.

---

## 💻 Cómo correr el proyecto en local (para desarrollar)

### Requisitos previos
- Python 3.10+
- Node.js 18+
- Git

### Pasos

**1. Clonar el repo:**
```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd LaVerde
```

**2. Crear el entorno virtual e instalar dependencias Python:**
```bash
python -m venv .venv
# Windows:
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**3. Crear el archivo `.env` en la raíz:**
```
cp .env.example .env
```
(No hace falta cambiar nada para correr en local)

**4. Abrir DOS terminales:**

Terminal 1 — Backend:
```powershell
.\.venv\Scripts\Activate.ps1
.\iniciar-backend.ps1
```

Terminal 2 — Frontend:
```powershell
.\iniciar-frontend.ps1
```

**5. Abrir el navegador en:** http://localhost:3000

---

## 🚫 Qué NO tocar nunca

| Archivo | Por qué |
|---|---|
| `render.yaml` | Configura todo el deploy en Render. Si se rompe, el deploy falla |
| `requirements.txt` | Dependencias del backend. Solo agregar, nunca borrar |
| `src/api/models.py` | Estructura de la base de datos. Cambios requieren migraciones |
| `src/api/admin.py` | Panel de administración |
| `.env` (local) | Nunca subir al repo, tiene claves secretas |

---

## ✅ Qué SÍ pueden hacer libremente

- Editar vistas en `tienda-frontend/src/views/`
- Editar componentes en `tienda-frontend/src/components/`
- Editar estilos en `tienda-frontend/src/App.css`
- Agregar rutas nuevas en `src/api/routes.py`
- Modificar el catálogo en `src/api/catalog_seed.py`

---

## ⚠️ Aviso importante sobre la base de datos

La base de datos de Render en plan **gratuito expira el 21 de junio de 2026**.
Después de esa fecha se borra si no se actualiza a un plan pago.

Si se borra, para restaurar los productos corren:
```powershell
$env:DATABASE_URL = "postgresql://laverde_db_user:NYw9VOru4YFymFVsWTI9HP9kDOek03H5@dpg-d88f81bbc2fs73e5mo2g-a.ohio-postgres.render.com/laverde_db"
python reparar_db.py
```

---

## 📞 Si algo se rompe

1. Revisar los logs en Render Dashboard → `laverde-backend` → Logs
2. Verificar que las variables de entorno estén cargadas en Render
3. Hacer "Manual Deploy" desde el Dashboard si hay cambios nuevos en el repo

---

*Proyecto: La Verde — Jorge · Emanuel · Braian*