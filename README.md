# LaVerde Tienda

E-commerce Fullstack: Flask & React

## Descripción Técnica

LaVerde Tienda es una plataforma de comercio electrónico desarrollada como proyecto fullstack para la academia 4Geeks. El backend implementa una API RESTful en Flask usando SQLAlchemy y autenticación JWT; el frontend es una SPA construida en React que comunica vía fetch/axios con el backend, integrando Cloudinary para gestión de imágenes y Bootstrap para UI responsiva.

## Tabla de Tecnologías

| Tecnología       | Propósito                      |
|------------------|-------------------------------|
| React            | Frontend SPA                  |
| Flask            | Backend/API RESTful           |
| SQLAlchemy       | ORM para base de datos        |
| JWT              | Autenticación segura          |
| Cloudinary       | Gestión de imágenes           |
| Bootstrap        | Estilos y componentes UI      |

## Guía de Inicio Rápido

### Clonar el proyecto

```bash
git clone https://github.com/Jorgeotero1998/LaVerde-Tienda.git
cd LaVerde-Tienda
```

---

### Backend (Flask)

```bash
cd src
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # Configura las variables de entorno
flask db upgrade               # Opcional: migraciones si aplica
flask run
```

---

### Frontend (React)

```bash
cd tienda-frontend
npm install
cp .env.example .env           # Configura las variables de entorno
npm start
```

---

## Variables de Entorno

Asegúrate de configurar correctamente ambas capas:

### Backend (`src/.env.example`)
```env
FLASK_APP=main.py
FLASK_ENV=development
DATABASE_URL=sqlite:///dev.db           # Cambia por tu motor de BD
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
```

### Frontend (`tienda-frontend/.env.example`)
```env
REACT_APP_API_URL=http://127.0.0.1:5000
```

## Despliegue en Producción

[https://laverde-frontend.onrender.com/}]

## Arquitectura

- **Backend:** API RESTful en Flask, modelos relacionales con SQLAlchemy, autenticación con JWT, almacenamiento de imágenes en Cloudinary.
- **Frontend:** SPA en React, consume servicios del backend vía fetch/axios.
- **Separación completa de frontend y backend** en directorios independientes para facilitar el despliegue y mantenimiento.

## Contacto

Consulta, issues o soporte vía [Issues de GitHub](https://github.com/Jorgeotero1998/LaVerde-Tienda/issues).
