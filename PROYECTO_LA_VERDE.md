# La Verde — Proyecto Final Fullstack

E-commerce de frutas y verduras frescas.

## Equipo / alcance

- **Tipo:** comercio electrónico (Home, catálogo, detalle, carrito, favoritos, perfil, pedidos, admin CRUD).
- **Stack:** React (CRA) + Flask + SQLAlchemy + JWT + SQLite (dev).

## Requisitos de la consigna

| Requisito | Cumplimiento |
|-----------|--------------|
| Diseño e-commerce | ✅ UI unificada tema verde premium |
| Registro, login, recuperar contraseña | ✅ |
| Contraseña cifrada (servidor) | ✅ Werkzeug hash |
| API propia | ✅ `/api/*` |
| ≥ 3 vistas + CRUD | ✅ 8+ vistas, admin CRUD productos |
| ≥ 1 API de terceros | ✅ Unsplash, Google Fonts, Font Awesome, Cloudinary |
| JWT | ✅ Bearer en rutas protegidas |
| Deploy producción | ⬜ Pendiente (ver sección Deploy) |
| GitHub Project + user stories | ⬜ Ver `USER_STORIES.md` |

## Integraciones externas

1. **API propia Flask** — auth, productos, carrito, favoritos, órdenes.
2. **Unsplash** — imágenes del catálogo (`image_url`).
3. **Google Fonts** — Fredoka One + Plus Jakarta Sans.
4. **Font Awesome + Bootstrap CDN** — iconos y componentes.
5. **Cloudinary** — subida de imágenes en panel admin (`POST /api/upload/image`).

## Cómo ejecutar en local

### Backend

```powershell
cd proyecto-tienda-Jorge-Emanuel-Braian
python -m pip install -r requirements.txt
copy .env.example .env
python run_backend.py
```

- API: http://127.0.0.1:3001/api/hello
- **Admin demo:** `admin@laverde.com` / `admin1234`

### Frontend

```powershell
cd tienda-frontend
copy .env.example .env
npm install
npm start
```

- App: http://localhost:3000

## Flujo de prueba (defensa oral)

1. Registrarse como usuario nuevo → login.
2. Agregar productos al carrito y favoritos.
3. Finalizar compra → ver **Mis pedidos**.
4. Login como admin → **Admin** → crear producto con foto (Cloudinary o URL).
5. Mostrar en DevTools header `Authorization: Bearer ...`.

## Deploy (pendiente)

### Backend (Render / Railway)

- Build: `pip install -r requirements.txt`
- Start: `python run_backend.py` o `gunicorn` apuntando a `src.app:app`
- Variables: `DATABASE_URL`, `JWT_SECRET_KEY`, `CLOUDINARY_*`

### Frontend (Vercel / Netlify)

- Build: `npm run build` en `tienda-frontend`
- Variable: `REACT_APP_BACKEND_URL=https://tu-api.onrender.com`

## Estructura del repo

```
proyecto-tienda-Jorge-Emanuel-Braian/
├── src/                 # Backend Flask
├── tienda-frontend/     # React app
├── run_backend.py       # Arranque fácil Windows
├── requirements.txt
├── USER_STORIES.md
└── INICIAR.md
```

## Autores

Jorge · Emanuel · Braian — La Verde
