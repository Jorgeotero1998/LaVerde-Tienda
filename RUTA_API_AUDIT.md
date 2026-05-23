# Auditoría de rutas API (backend Flask)

Esta auditoría corresponde a la rama `preparacion-entrega` y refleja el estado al 2026-05-23 según los archivos explorados (máx. 10 resultados por limitación técnica, consulta el [repositorio completo aquí](https://github.com/Jorgeotero1998/LaVerde-Tienda)).

## Rutas encontradas:

**Recurso productos:**
- `GET    /api/products`           ✅ RESTful, listado de productos
- `GET    /api/products/<id>`      ✅ RESTful, detalle de producto
- `POST   /api/products`           ✅ RESTful, crear producto
- `PUT    /api/products/<id>`      ✅ RESTful, modificar producto
- `DELETE /api/products/<id>`      ✅ RESTful, baja lógica
- `POST   /api/products/<id>/image` 🟡 Parcial: Es aceptable para cargar recursos secundarios, pero puede documentarse mejor

**Favoritos**
- `/api/favorites` (sólo encabezado encontrado, no se listó implementación — revisar código para detalle definitivo)

## Análisis de estandarización
- Todas las rutas principales siguen el prefijo estándar `/api/` requerido por 4Geeks Academy.
- Los nombres de recursos están en plural y en inglés.
- Las rutas implementan los verbos HTTP correspondientes (GET, POST, PUT, DELETE).
- Los endpoints secundarios (como `/image`) no rompen la convención REST si representan sub-recursos.
- Sugerido: Asegurarse que TODOS los recursos y controladores sigan este esquema.

**Nota:**
Debido a la limitación de la búsqueda, revisa también si existen rutas atípicas fuera del archivo src/api/routes.py.

---

_Esta auditoría es útil para la checklist de entrega profesional.  Si necesitas una revisión profunda de otros endpoints (users, orders, auth, etc.), revisa más archivos en el repositorio o notifica para asistencia ampliada._
