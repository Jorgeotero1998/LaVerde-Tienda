# 🌿 LaVerde Tienda

Plataforma de e-commerce integral desarrollada con Flask (Backend) y React (Frontend).

## 🚀 Tecnologías

### Backend
- **Framework:** Flask (Python)
- **Seguridad:** JWT (JSON Web Tokens)
- **Almacenamiento de imágenes:** Cloudinary
- **Notificaciones:** Mailgun API

### Frontend
- **Framework:** React con Vite

## 🛠️ Estructura del Proyecto



- /src: Lógica del servidor, rutas de API, modelos de base de datos y utilidades.
- /tienda-frontend: Aplicación cliente basada en componentes.
- /instance: Base de datos SQLite local (excluida del control de versiones).

## ⚙️ Configuración y Despliegue

### Requisitos previos
- Python 3.10+
- Node.js 18+

### Instrucciones de instalación
1. Clonar el repositorio:
   git clone https://github.com/Jorgeotero1998/LaVerde-Tienda.git

2. Backend:
   pip install -r requirements.txt
   python -m flask run --port=3001

3. Frontend:
   cd tienda-frontend
   npm install
   npm run dev

## 📝 Contribuciones
Este proyecto es el resultado del esfuerzo conjunto para crear una solución escalable de venta minorista. Se agradece cualquier sugerencia a través de Pull Requests.
