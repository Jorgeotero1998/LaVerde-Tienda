# Checklist de Deploy — La Verde


## Pasos para hacer el deploy



### 3. Crear el Blueprint en Render
1. Ir a https://dashboard.render.com
2. New → Blueprint
3. Conectar tu repositorio de GitHub
4. Render va a detectar el `render.yaml` y crear los 3 recursos automáticamente:
   - `laverde-backend` (web service Python)
   - `laverde-frontend` (static site)
   - `laverde-db` (PostgreSQL)

### 4. Configurar variables en el Dashboard
Una vez creados los servicios, ir a cada uno y completar las variables marcadas con `sync: false`:

**laverde-backend → Environment:**
| Variable | Valor |
|---|---|
| `JWT_SECRET_KEY` | Cadena larga aleatoria (ej: corré `python -c "import secrets; print(secrets.token_hex(32))"`) |
| `FLASK_APP_KEY` | Otra cadena secreta distinta |
| `FRONTEND_URL` | La URL que Render asignó al frontend (ej: `https://laverde-frontend.onrender.com`) |
| `CLOUDINARY_CLOUD_NAME` | De tu cuenta cloudinary.com (opcional) |
| `CLOUDINARY_API_KEY` | Ídem (opcional) |
| `CLOUDINARY_API_SECRET` | Ídem (opcional) |

**laverde-frontend → Environment:**
| Variable | Valor |
|---|---|
| `REACT_APP_BACKEND_URL` | La URL que Render asignó al backend (ej: `https://laverde-backend.onrender.com`) |

### 5. Orden de las URLs (dependencia cruzada)
Las dos URLs se conocen recién después de crear el Blueprint.
El orden correcto es:
1. Crear el Blueprint → Render genera las URLs
2. Copiar la URL del backend → pegarla en `REACT_APP_BACKEND_URL` del frontend
3. Copiar la URL del frontend → pegarla en `CORS_ORIGINS` del backend (ya en render.yaml)
4. En **laverde-backend → Environment**, setear `DATABASE_URL` = Internal Database URL de `laverde-db`
5. Hacer **Manual Deploy** en **ambos** servicios (backend primero) tras cada push a `main`

> Si `/api/diag` devuelve 404, el backend sigue en código viejo — forzá Manual Deploy en Render.

---

## Verificación post-deploy

1. Abrir `https://laverde-backend.onrender.com/api/hello`
   → Debe responder `{"message": "Backend conectado correctamente"}`

2. Abrir `https://laverde-frontend.onrender.com`
   → Debe cargar la app con los productos

3. Registrar un usuario nuevo → confirmar que se guarda en la DB de Render

---

## Nota sobre el plan free de Render
Los servicios web free se "duermen" tras 15 minutos de inactividad.
La primera request después de dormir tarda ~30 segundos (cold start).
La base de datos PostgreSQL free se elimina tras 90 días de inactividad.
