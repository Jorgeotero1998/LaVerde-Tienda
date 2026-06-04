# 🌿 LaVerde Tienda
[![MIT License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org)
[![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen)](#)

Plataforma de e-commerce fullstack desarrollada con Flask y React como proyecto final de 4Geeks Academy.

🔗 **Demo en producción:** https://laverde-frontend.onrender.com

---

## 🚀 Tecnologías

### Backend
- **Framework:** Flask (Python)
- **Base de datos:** PostgreSQL (producción) / SQLite (desarrollo)
- **ORM:** SQLAlchemy + Flask-Migrate
- **Seguridad:** JWT (JSON Web Tokens) + Werkzeug password hashing
- **Almacenamiento de imágenes:** Cloudinary
- **Deploy:** Render

### Frontend
- **Framework:** React (Create React App)
- **Estilos:** Bootstrap 5 + CSS personalizado
- **Routing:** React Router v6
- **Deploy:** Render (Static Site)

---

## 📸 Screenshots

<img width="1877" height="897" alt="2" src="https://github.com/user-attachments/assets/b29da2c2-9ee2-4f8b-b0f0-4c4f216b6f8b" />
<img width="1865" height="897" alt="1" src="https://github.com/user-attachments/assets/0f01299f-aace-4021-b51f-7acf2d7a06a9" />
<img width="1855" height="900" alt="3" src="https://github.com/user-attachments/assets/67548312-5de6-49af-9e3b-5294b03703e2" />
<img width="1873" height="892" alt="7" src="https://github.com/user-attachments/assets/140089ad-0a56-4522-bc09-299b7b46450d" />
<img width="1865" height="892" alt="6" src="https://github.com/user-attachments/assets/f014a02a-211a-4ee6-ad95-211e615fcc05" />
<img width="1858" height="900" alt="5" src="https://github.com/user-attachments/assets/b0f06c8d-21fb-48a9-9276-0f2beb4c76ba" />
<img width="1857" height="896" alt="4" src="https://github.com/user-attachments/assets/7446f7ed-7587-480c-830c-73f839a38133" />

---

## 🛠️ Estructura del proyecto

```
LaVerde-Tienda/
├── src/                  # Backend Flask
│   └── api/
│       ├── models.py     # Modelos SQLAlchemy
│       ├── routes.py     # Endpoints de la API
│       ├── admin.py      # Panel de administración
│       └── commands.py   # Comandos Flask CLI
├── tienda-frontend/      # Frontend React
│   └── src/
│       ├── views/        # Páginas de la app
│       ├── components/   # Componentes reutilizables
│       ├── flux.js       # Estado global (acciones)
│       └── api/client.js # Cliente HTTP
├── render.yaml           # Configuración de deploy
└── requirements.txt      # Dependencias Python
```

---

## ⚙️ Correr en local

### Requisitos previos
- Python 3.10+
- Node.js 18+
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jorgeotero1998/LaVerde-Tienda.git
cd LaVerde-Tienda
```

### 2. Configurar el backend
```bash
# Crear entorno virtual
python -m venv .venv

# Activar (Windows)
.\.venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Copiar variables de entorno
cp .env.example .env
```

### 3. Correr backend y frontend

Abrí **dos terminales** desde la raíz del proyecto:

**Terminal 1 — Backend** (http://127.0.0.1:3001):
```powershell
.\.venv\Scripts\Activate.ps1
.\iniciar-backend.ps1
```

**Terminal 2 — Frontend** (http://localhost:3000):
```powershell
.\iniciar-frontend.ps1
```

---

## 🔑 Variables de entorno

### Backend (`.env` en la raíz)
```
DATABASE_URL=sqlite:///instance/laverde.db
JWT_SECRET_KEY=tu-clave-secreta
FLASK_APP_KEY=tu-clave-flask
CLOUDINARY_CLOUD_NAME=          # opcional
CLOUDINARY_API_KEY=             # opcional
CLOUDINARY_API_SECRET=          # opcional
```

### Frontend (`tienda-frontend/.env`)
```
REACT_APP_BACKEND_URL=http://127.0.0.1:3001
```

---

## 👤 Usuario admin (demo)

| Campo | Valor |
|---|---|
| Email | admin@laverde.com |
| Contraseña | admin1234 |
| Panel admin | https://laverde-backend.onrender.com/admin |

---

## 🌐 API — Endpoints principales
---

## 📚 Documentación Completa

Para más detalles, consulta:

- **[Arquitectura & Decisiones de Diseño](docs/PROYECTO_LA_VERDE.md)** — Stack técnico, requisitos, flujo de prueba
- **[Checklist de Deploy](docs/DEPLOY_CHECKLIST.md)** — Pasos para subir a producción en Render
- **[Entrega Profesional](docs/ENTREGA_FINAL.md)** — Checklist de calidad
- **[User Stories](docs/USER_STORIES.md)** — Funcionalidades y casos de uso
- **[API Audit](docs/RUTA_API_AUDIT.md)** — Endpoints documentados

---

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/signup` | Registro de usuario |
| POST | `/api/login` | Login → devuelve JWT |
| GET | `/api/products` | Catálogo de productos |
| GET | `/api/cart` | Carrito (requiere JWT) |
| POST | `/api/orders` | Confirmar pedido (requiere JWT) |
| GET | `/api/favorites` | Favoritos (requiere JWT) |

## Tests
\```bash
$env:PYTHONPATH = "src"
pytest test_api.py -v   # 44 tests
\```

---

## 📝 Autores

Jorge · Emanuel · Braian — La Verde · 4Geeks Academy 2026
