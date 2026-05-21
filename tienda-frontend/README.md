# La Verde - Frontend

Frontend de una tienda e-commerce de frutas, verduras y productos frescos. Esta carpeta contiene la aplicacion React que consume un backend Flask externo, muestra el catalogo, permite comprar productos, gestionar favoritos, consultar pedidos, editar el perfil de usuario y administrar el inventario cuando la cuenta tiene permisos de administrador.

Este README documenta exclusivamente la carpeta `tienda-frontend`. El backend existe fuera de esta carpeta y debe estar corriendo para que los flujos conectados al servidor funcionen correctamente.

## Indice

- [Descripcion general](#descripcion-general)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Instalacion](#instalacion)
- [Variables de entorno](#variables-de-entorno)
- [Ejecucion en desarrollo](#ejecucion-en-desarrollo)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura de la aplicacion](#arquitectura-de-la-aplicacion)
- [Rutas del frontend](#rutas-del-frontend)
- [Estado global y contexto](#estado-global-y-contexto)
- [Cliente API](#cliente-api)
- [Persistencia en localStorage](#persistencia-en-localstorage)
- [Catalogo y productos](#catalogo-y-productos)
- [Autenticacion](#autenticacion)
- [Carrito de compras](#carrito-de-compras)
- [Favoritos](#favoritos)
- [Pedidos](#pedidos)
- [Perfil de usuario](#perfil-de-usuario)
- [Panel de administracion](#panel-de-administracion)
- [Componentes principales](#componentes-principales)
- [Estilos y sistema visual](#estilos-y-sistema-visual)
- [Integracion con el backend](#integracion-con-el-backend)
- [Cuenta admin de prueba](#cuenta-admin-de-prueba)
- [Build de produccion](#build-de-produccion)
- [Deploy](#deploy)
- [Problemas comunes](#problemas-comunes)
- [Posibles mejoras](#posibles-mejoras)

## Descripcion general

`tienda-frontend` es una aplicacion de una sola pagina construida con React. La experiencia esta pensada para una verduleria/tienda de productos frescos llamada **La Verde**.

La aplicacion permite:

- Ver un catalogo de productos frescos.
- Buscar productos desde la barra superior.
- Filtrar productos por categoria.
- Entrar al detalle de cada producto.
- Agregar productos al carrito.
- Comprar como usuario autenticado.
- Mantener un carrito temporal como invitado.
- Registrar una cuenta nueva.
- Iniciar sesion.
- Recuperar contrasena.
- Guardar productos favoritos.
- Consultar historial de pedidos.
- Editar datos personales.
- Acceder a un panel admin para crear, editar y eliminar productos.
- Subir imagenes de productos mediante el backend y Cloudinary cuando esa integracion esta configurada.

El frontend tiene un catalogo de respaldo local. Esto permite que la tienda siga mostrando productos aunque el backend no responda, pero las funciones que dependen de usuario, pedidos, favoritos, carrito autenticado y administracion requieren servidor.

## Tecnologias utilizadas

### Librerias principales

- **React 19**: libreria principal para construir la interfaz.
- **React DOM 19**: renderizado de la app en el navegador.
- **React Router DOM 7**: manejo de rutas internas.
- **Bootstrap 5**: base de estilos utilitarios y grilla responsive.
- **Font Awesome**: iconografia de la interfaz.
- **Recharts**: dependencia disponible para graficos, aunque en el codigo actual no se utiliza como pieza central.
- **Web Vitals**: medicion de performance incluida por Create React App.

### Herramientas

- **React Scripts 5**: scripts de desarrollo, build y test.
- **Testing Library**: utilidades para pruebas de componentes.
- **Jest DOM**: matchers adicionales para tests.

## Requisitos previos

Antes de levantar el frontend se necesita:

- Node.js instalado.
- npm instalado.
- Backend Flask corriendo en `http://127.0.0.1:3001`.

Version recomendada:

```bash
node -v
npm -v
```

El proyecto puede funcionar con Node 18 o superior. Si aparecen errores de compatibilidad con `react-scripts`, se recomienda usar una version LTS de Node.

## Instalacion

Desde la raiz del repositorio, entrar a la carpeta del frontend:

```bash
cd tienda-frontend
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo de entorno local:

```bash
cp .env.example .env
```

En Windows PowerShell tambien se puede usar:

```powershell
Copy-Item .env.example .env
```

## Variables de entorno

El archivo `.env.example` incluye:

```env
REACT_APP_BACKEND_URL=http://127.0.0.1:3001
```

Esta variable define la URL base del backend Flask. No debe incluir `/api` al final, porque el cliente API lo agrega automaticamente.

Correcto:

```env
REACT_APP_BACKEND_URL=http://127.0.0.1:3001
```

Incorrecto:

```env
REACT_APP_BACKEND_URL=http://127.0.0.1:3001/api
```

Si el backend esta desplegado, por ejemplo en Render, la variable deberia apuntar a la URL publica:

```env
REACT_APP_BACKEND_URL=https://mi-backend.onrender.com
```

Importante: en Create React App las variables disponibles en el navegador deben comenzar con `REACT_APP_`.

## Ejecucion en desarrollo

Con dependencias instaladas y `.env` configurado:

```bash
npm start
```

La app abre normalmente en:

```text
http://localhost:3000
```

El frontend espera que el backend este disponible en:

```text
http://127.0.0.1:3001/api
```

Flujo recomendado para probar todo:

1. Levantar el backend desde la raiz del repositorio.
2. Levantar este frontend desde `tienda-frontend`.
3. Abrir `http://localhost:3000`.
4. Probar registro, login, carrito, favoritos, pedidos y administracion.

## Scripts disponibles

En `package.json` existen estos scripts:

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

### `npm start`

Inicia el servidor de desarrollo.

Uso:

```bash
npm start
```

### `npm run build`

Genera una version optimizada para produccion en la carpeta `build`.

Uso:

```bash
npm run build
```

### `npm test`

Ejecuta la suite de pruebas en modo interactivo.

Uso:

```bash
npm test
```

### `npm run eject`

Expone la configuracion interna de Create React App. Es una accion irreversible y no se recomienda salvo que sea estrictamente necesario.

## Estructura del proyecto

Estructura principal de `tienda-frontend`:

```text
tienda-frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   └── iconos y favicons
├── src/
│   ├── api/
│   │   └── client.js
│   ├── components/
│   │   ├── AdminRoute.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── PageHeader.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── ProductCard.jsx
│   ├── copy/
│   │   ├── adminStrings.js
│   │   └── authStrings.js
│   ├── data/
│   │   └── catalogFallback.js
│   ├── utils/
│   │   └── favoriteMatch.js
│   ├── views/
│   │   ├── Admin.jsx
│   │   ├── Cart.jsx
│   │   ├── Favorites.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Profile.jsx
│   │   └── Signup.jsx
│   ├── App.css
│   ├── App.js
│   ├── flux.js
│   ├── index.css
│   ├── index.js
│   ├── injectContext.js
│   └── layout.js
├── .env.example
├── package.json
└── README.md
```

## Arquitectura de la aplicacion

La aplicacion esta organizada en cuatro capas principales:

1. **Entrada de la app**
   - `src/index.js`
   - Renderiza React en el DOM.
   - Importa Bootstrap, Font Awesome y estilos globales.
   - Envuelve `App` con el contexto global mediante `injectContext`.

2. **Ruteo**
   - `src/App.js`
   - Define todas las rutas del frontend.
   - Monta `Navbar`, contenido principal y `Footer`.
   - Protege rutas privadas y rutas admin.

3. **Estado global**
   - `src/flux.js`
   - Contiene `store` y `actions`.
   - Centraliza productos, usuario, token, carrito, favoritos, pedidos, errores y mensajes.

4. **Consumo del backend**
   - `src/api/client.js`
   - Construye la URL del API.
   - Adjunta JWT cuando corresponde.
   - Normaliza errores.
   - Incluye helpers para mapear carrito y favoritos.

## Rutas del frontend

Las rutas estan definidas en `src/App.js`.

| Ruta | Componente | Acceso | Descripcion |
| --- | --- | --- | --- |
| `/` | `Home` | Publico | Catalogo principal, busqueda y filtros. |
| `/product/:id` | `ProductDetail` | Publico | Detalle de producto y productos relacionados. |
| `/login` | `Login` | Publico | Inicio de sesion. |
| `/signup` | `Signup` | Publico | Registro de usuario. |
| `/forgot-password` | `ForgotPassword` | Publico | Recuperacion de contrasena. |
| `/cart` | `Cart` | Publico/parcial | Checkout visual; requiere login para confirmar pedido. |
| `/favorites` | `Favorites` | Privado | Productos favoritos del usuario. |
| `/profile` | `Profile` | Privado | Edicion de datos personales. |
| `/orders` | `Orders` | Privado | Historial de pedidos. |
| `/admin` | `Admin` | Admin | Gestion de inventario. |

### Rutas privadas

Las rutas privadas usan `PrivateRoute`.

Si no existe `store.token`, el usuario es redirigido a:

```text
/login
```

### Ruta admin

La ruta `/admin` usa `AdminRoute`.

Condiciones:

- Debe existir token.
- El usuario debe tener `store.user.isAdmin === true`.

Si no hay token, redirige a login. Si hay token pero el usuario no es admin, muestra una pantalla de acceso restringido.

## Estado global y contexto

El estado global se crea en `src/flux.js` y se inyecta mediante `src/injectContext.js`.

### Store inicial

El `store` incluye:

```js
{
  products: prodSample,
  product: {},
  cart: readGuestCart(),
  favorites: [],
  orders: [],
  token: localStorage.getItem("laverde_token") || null,
  user: JSON.parse(localStorage.getItem("laverde_user") || "null"),
  error: null,
  message: null
}
```

### Responsabilidades del store

- Mantener la lista de productos.
- Mantener el producto seleccionado.
- Guardar el carrito actual.
- Guardar favoritos.
- Guardar pedidos.
- Guardar sesion activa.
- Guardar mensajes y errores globales.

### Acciones principales

| Accion | Funcion |
| --- | --- |
| `clearMessage` | Limpia mensajes y errores. |
| `getProducts` | Obtiene productos del backend o usa catalogo fallback. |
| `getProduct` | Busca un producto por id dentro del store. |
| `signup` | Registra usuario nuevo. |
| `login` | Inicia sesion y guarda token/usuario. |
| `logout` | Limpia sesion y datos locales. |
| `syncSession` | Valida sesion, trae perfil, carrito y favoritos. |
| `fetchCart` | Carga carrito desde backend. |
| `fetchFavorites` | Carga favoritos desde backend. |
| `mergeGuestCartToApi` | Migra carrito invitado al backend despues del login. |
| `addToCart` | Agrega producto al carrito local o remoto. |
| `removeFromCart` | Elimina producto del carrito. |
| `updateCartQuantity` | Actualiza cantidad de un producto. |
| `clearCart` | Vacia carrito. |
| `checkoutOrder` | Crea una orden en backend. |
| `toggleFavorite` | Agrega o elimina favorito. |
| `forgotPassword` | Solicita recuperacion de contrasena. |
| `updateProfile` | Actualiza datos del usuario. |
| `getOrders` | Obtiene historial de pedidos. |

## Cliente API

El archivo `src/api/client.js` centraliza la comunicacion HTTP.

### `getApiBase`

Construye la URL base:

```js
(process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:3001") + "/api"
```

Si `.env` no existe, usa `http://127.0.0.1:3001/api` por defecto.

### `getToken`

Lee el JWT desde:

```text
localStorage.laverde_token
```

### `apiFetch`

Wrapper sobre `fetch`.

Hace lo siguiente:

- Agrega `Content-Type: application/json`.
- Agrega `Authorization: Bearer <token>` si hay token.
- Serializa el body como JSON.
- Intenta parsear la respuesta como JSON.
- Ejecuta handler de logout si el backend responde `401`.
- Lanza un `Error` si la respuesta no es exitosa.

Ejemplo conceptual:

```js
apiFetch("/products", { token: null });
apiFetch("/cart", { method: "POST", body: { product_id: 1, quantity: 2 } });
```

### `apiUploadImage`

Sube imagenes con `FormData`.

Se usa en el panel admin para:

```text
POST /api/upload/image
```

Requiere usuario admin y token JWT.

### Mapeo de datos

`mapCartFromApi` transforma items del backend al formato que usa la UI:

```js
{
  ...product,
  id,
  quantity,
  cartItemId
}
```

`mapFavoritesFromApi` transforma favoritos a:

```js
{ product_id }
```

## Persistencia en localStorage

La aplicacion usa `localStorage` para mantener datos entre recargas.

| Clave | Uso |
| --- | --- |
| `laverde_token` | JWT del usuario autenticado. |
| `laverde_user` | Datos serializados del usuario. |
| `laverde_cart` | Carrito de invitado antes de iniciar sesion. |
| `laverde_products_v2` | Cache de productos obtenidos del backend. |
| `laverde_products` | Clave heredada que se limpia al cargar productos desde API. |

### Carrito invitado

Si el usuario no inicio sesion, el carrito se guarda en:

```text
laverde_cart
```

Cuando el usuario inicia sesion, `mergeGuestCartToApi` envia cada item al backend y luego elimina el carrito local.

## Catalogo y productos

La vista principal del catalogo esta en:

```text
src/views/Home.jsx
```

Funciones principales:

- Cargar productos con `actions.getProducts()`.
- Leer busqueda desde query param `?q=`.
- Filtrar por categoria.
- Filtrar por texto en nombre o descripcion.
- Renderizar tarjetas con `ProductCard`.

Categorias usadas en sidebar:

- Todos
- Frutas
- Citricos
- Verduras
- Pecuarios
- Hierbas
- Condimentos

El catalogo tambien cuenta con fallback local en:

```text
src/data/catalogFallback.js
```

Ese fallback se usa cuando el backend no responde.

## Autenticacion

La autenticacion se basa en JWT.

### Registro

Vista:

```text
src/views/Signup.jsx
```

Accion:

```js
actions.signup(firstName, lastName, email, password)
```

Endpoint:

```text
POST /api/signup
```

Validaciones del frontend:

- Todos los campos requeridos.
- Confirmacion de contrasena.
- Minimo de 4 caracteres para la contrasena.

### Login

Vista:

```text
src/views/Login.jsx
```

Accion:

```js
actions.login(email, password)
```

Endpoint:

```text
POST /api/login
```

Si el login es correcto:

- Guarda `laverde_token`.
- Guarda `laverde_user`.
- Migra carrito invitado al backend.
- Carga carrito remoto.
- Carga favoritos.
- Redirige al home.

### Logout

Accion:

```js
actions.logout()
```

Limpia:

- Token.
- Usuario.
- Carrito invitado.
- Carrito en store.
- Favoritos.
- Pedidos.

### Recuperacion de contrasena

Vista:

```text
src/views/ForgotPassword.jsx
```

Endpoint:

```text
POST /api/forgot-password
```

El frontend muestra una pantalla de confirmacion cuando el backend responde correctamente.

## Carrito de compras

El carrito aparece en dos lugares:

- Drawer lateral: `src/components/CartDrawer.jsx`
- Pagina de checkout: `src/views/Cart.jsx`

### Drawer lateral

El drawer se abre desde:

- Boton del carrito en `Navbar`.
- Evento global `open-cart-drawer` disparado al agregar un producto.

Caracteristicas:

- Muestra productos agregados.
- Permite aumentar o reducir cantidad.
- Permite eliminar productos.
- Muestra subtotal.
- Enlaza a `/cart`.
- Cierra con Escape o click en backdrop.

### Pagina `/cart`

La vista `Cart.jsx` permite:

- Ver productos del carrito.
- Cambiar cantidades.
- Eliminar productos.
- Vaciar carrito.
- Calcular subtotal.
- Calcular envio.
- Finalizar compra si el usuario esta autenticado.

Constantes de checkout:

```js
const SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 350;
```

Si el subtotal supera el umbral, el envio se considera gratis.

### Checkout

Accion:

```js
actions.checkoutOrder()
```

Endpoint:

```text
POST /api/orders
```

Condiciones:

- El usuario debe estar logueado.
- El carrito no puede estar vacio.

Cuando el pedido se confirma:

- Se muestra pantalla de exito.
- Se limpia/recarga carrito.
- Se redirige a `/orders`.

## Favoritos

Vista:

```text
src/views/Favorites.jsx
```

Componente relacionado:

```text
src/components/ProductCard.jsx
```

Utilidad:

```text
src/utils/favoriteMatch.js
```

Los favoritos requieren sesion iniciada.

Endpoints:

```text
GET /api/favorites
POST /api/favorites
DELETE /api/favorites/:product_id
```

La funcion `isFavoriteProduct` compara ids convirtiendolos a numero. Esto evita errores cuando un id llega como string desde una fuente y como number desde otra.

## Pedidos

Vista:

```text
src/views/Orders.jsx
```

Accion:

```js
actions.getOrders()
```

Endpoint:

```text
GET /api/orders
```

La vista muestra:

- Numero de pedido.
- Fecha formateada.
- Estado.
- Total.
- Cantidad de productos.
- Lineas de pedido con cantidad, nombre y subtotal por item.

Si no hay pedidos, muestra un estado vacio con enlace para volver a la tienda.

## Perfil de usuario

Vista:

```text
src/views/Profile.jsx
```

Funciones:

- Mostrar datos del usuario actual.
- Editar nombre, apellido y email.
- Mostrar estadisticas rapidas:
  - Cantidad de productos en carrito.
  - Cantidad de favoritos.
  - Total actual del carrito.
- Cerrar sesion.

Endpoint:

```text
PUT /api/me
```

La accion global `updateProfile` actualiza el backend y luego reemplaza `laverde_user` en `localStorage`.

## Panel de administracion

Vista:

```text
src/views/Admin.jsx
```

Ruta:

```text
/admin
```

Proteccion:

```text
AdminRoute
```

El panel admin permite:

- Ver inventario.
- Crear productos.
- Editar productos.
- Eliminar productos del catalogo.
- Subir imagen de producto con Cloudinary.
- Pegar URL manual de imagen.
- Previsualizar imagen.

### Campos del formulario admin

- Nombre.
- Categoria.
- Precio.
- Stock.
- Unidad.
- Imagen por archivo.
- Imagen por URL.
- Descripcion.

### Categorias admin

```js
[
  "Verduras",
  "Frutas",
  "Citricos",
  "Hierbas",
  "Condimentos",
  "Pecuarios"
]
```

### Endpoints admin

```text
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
POST /api/upload/image
```

Para crear, editar, eliminar o subir imagen se necesita token de admin.

## Componentes principales

### `Navbar.jsx`

Barra superior de navegacion.

Responsabilidades:

- Mostrar marca La Verde.
- Buscar productos.
- Navegar a Inicio y Productos.
- Mostrar enlaces privados cuando hay sesion.
- Mostrar enlace Admin si el usuario es admin.
- Mostrar contador de favoritos.
- Mostrar boton de carrito con contador.
- Abrir `CartDrawer`.
- Ejecutar logout.

### `Footer.jsx`

Pie de pagina con:

- Marca.
- Enlaces utiles.
- Datos de contacto.
- Ano actual dinamico.

### `ProductCard.jsx`

Tarjeta reutilizable para productos.

Incluye:

- Imagen.
- Precio.
- Nombre.
- Descripcion.
- Boton de agregar al carrito.
- Boton de favorito para usuarios logueados.
- Badge sin stock.
- Navegacion al detalle al hacer click.

### `CartDrawer.jsx`

Carrito lateral.

Incluye:

- Overlay/backdrop.
- Cierre con Escape.
- Lista de items.
- Controles de cantidad.
- Eliminacion de productos.
- Subtotal.
- Enlace al checkout.

### `PrivateRoute.jsx`

Protege rutas que requieren sesion.

### `AdminRoute.jsx`

Protege rutas que requieren rol administrador.

### `AuthLayout.jsx`

Layout reutilizable para pantallas de autenticacion:

- Login.
- Registro.
- Recuperacion de contrasena.

### `PageHeader.jsx`

Cabecera reutilizable para paginas internas.

Puede mostrar:

- Titulo.
- Subtitulo.
- Link de volver.

## Estilos y sistema visual

Los estilos principales estan en:

```text
src/App.css
```

Tambien existe:

```text
src/index.css
```

`App.css` define un sistema visual oscuro premium con variables CSS:

- Colores base.
- Gradientes.
- Superficies.
- Bordes.
- Sombras.
- Espaciados.
- Radios.
- Transiciones.
- Componentes visuales reutilizables.

Algunas clases importantes:

| Clase | Uso |
| --- | --- |
| `app-wrapper` | Contenedor general de la app. |
| `navbar-verde` | Navbar principal. |
| `hero-banner` | Hero del home. |
| `catalog-layout` | Layout del catalogo con sidebar. |
| `product-grid` | Grilla de productos. |
| `product-card` | Tarjeta de producto. |
| `btn-accent` | Boton principal. |
| `btn-outline-accent` | Boton secundario. |
| `ui-panel` | Panel visual reutilizable. |
| `ui-alert` | Alertas de error/exito. |
| `auth-page` | Layout de autenticacion. |
| `cart-drawer` | Drawer lateral del carrito. |
| `checkout-layout` | Layout de checkout. |
| `page-header` | Encabezado de paginas internas. |

La app tambien usa clases de Bootstrap como:

- `container`
- `row`
- `col-md-*`
- `d-flex`
- `gap-*`
- `mb-*`
- `text-end`
- `table-responsive`

## Integracion con el backend

El frontend espera una API REST con prefijo `/api`.

Endpoints usados:

| Metodo | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/api/products` | Listar productos. |
| `GET` | `/api/products/:id` | El frontend no lo usa directamente; obtiene detalle desde store. |
| `POST` | `/api/signup` | Registrar usuario. |
| `POST` | `/api/login` | Iniciar sesion. |
| `POST` | `/api/forgot-password` | Recuperar contrasena. |
| `GET` | `/api/me` | Obtener perfil actual. |
| `PUT` | `/api/me` | Actualizar perfil. |
| `GET` | `/api/cart` | Obtener carrito autenticado. |
| `POST` | `/api/cart` | Agregar item al carrito. |
| `PUT` | `/api/cart/:product_id` | Cambiar cantidad. |
| `DELETE` | `/api/cart/:product_id` | Eliminar item. |
| `DELETE` | `/api/cart` | Vaciar carrito. |
| `GET` | `/api/favorites` | Obtener favoritos. |
| `POST` | `/api/favorites` | Agregar favorito. |
| `DELETE` | `/api/favorites/:product_id` | Eliminar favorito. |
| `GET` | `/api/orders` | Obtener pedidos. |
| `POST` | `/api/orders` | Crear pedido. |
| `POST` | `/api/products` | Crear producto admin. |
| `PUT` | `/api/products/:id` | Editar producto admin. |
| `DELETE` | `/api/products/:id` | Eliminar producto admin. |
| `POST` | `/api/upload/image` | Subir imagen admin. |

### Manejo de errores de red

Cuando el backend no esta disponible, algunas acciones muestran mensajes como:

```text
No se pudo conectar al servidor. Ejecuta: python run_backend.py
```

El catalogo puede seguir funcionando con `catalogFallback.js`, pero login, registro, favoritos, pedidos y admin necesitan backend.

### Sesion expirada

`apiFetch` detecta respuestas `401`.

Cuando ocurre:

- Ejecuta el handler registrado por `setUnauthorizedHandler`.
- El handler llama a `actions.logout()`.
- La sesion local se limpia.

## Cuenta admin de prueba

El backend del proyecto crea o asegura una cuenta admin de prueba:

```text
Email: admin@laverde.com
Password: admin1234
```

Con esa cuenta se puede entrar al panel:

```text
/admin
```

Desde el frontend, el link Admin aparece en la barra superior solo si:

```js
store.user?.isAdmin
```

es verdadero.

## Build de produccion

Para generar la version final:

```bash
npm run build
```

Esto crea:

```text
tienda-frontend/build/
```

Esa carpeta contiene HTML, JS y CSS optimizados para produccion.

Antes del build, configurar correctamente:

```env
REACT_APP_BACKEND_URL=https://url-publica-del-backend
```

Importante: en Create React App las variables de entorno se incorporan durante el build. Si se cambia la URL del backend despues de buildear, hay que ejecutar `npm run build` nuevamente.

## Deploy

El frontend se puede desplegar en servicios como:

- Netlify.
- Vercel.
- Render Static Site.
- GitHub Pages con configuracion adicional.
- Cualquier hosting estatico que sirva la carpeta `build`.

### Configuracion general de deploy

Build command:

```bash
npm run build
```

Publish directory:

```text
build
```

Variable de entorno:

```env
REACT_APP_BACKEND_URL=https://url-publica-del-backend
```

### Consideraciones de CORS

El backend debe permitir requests desde la URL donde este desplegado el frontend.

Si el frontend desplegado no puede iniciar sesion o consumir productos, revisar:

- URL de `REACT_APP_BACKEND_URL`.
- Que no tenga `/api` duplicado.
- Que el backend este encendido.
- Que CORS permita el dominio del frontend.
- Que la API responda en `/api/hello` o `/api/products`.

## Problemas comunes

### La pantalla carga pero no puedo iniciar sesion

Posibles causas:

- El backend no esta corriendo.
- `REACT_APP_BACKEND_URL` apunta a una URL incorrecta.
- Se agrego `/api` al final de la variable.
- El backend responde con error 500.
- Hay un problema de CORS.

Solucion sugerida:

```bash
curl http://127.0.0.1:3001/api/hello
```

Si no responde, levantar el backend.

### Veo productos aunque el backend este apagado

Es esperado. La app usa:

```text
src/data/catalogFallback.js
```

Ese catalogo local permite mostrar productos sin servidor.

### No aparecen favoritos

Los favoritos requieren:

- Usuario logueado.
- Token valido.
- Backend corriendo.
- Endpoint `/api/favorites` funcionando.

### No aparece el link Admin

El link Admin aparece solo si el usuario actual tiene:

```js
isAdmin: true
```

Usar la cuenta admin de prueba o verificar el usuario en backend.

### No puedo subir imagenes desde Admin

La subida depende de:

- Backend corriendo.
- Usuario admin.
- Token valido.
- Cloudinary configurado en el backend.

Si Cloudinary no esta configurado, se puede pegar manualmente una URL de imagen en el campo correspondiente.

### Cambie `.env` pero no cambio la API

En desarrollo, reiniciar `npm start`.

En produccion, volver a ejecutar:

```bash
npm run build
```

### El carrito se pierde al cerrar sesion

Es el comportamiento actual. `logout` elimina:

```text
laverde_cart
```

y limpia el carrito del store.

### El carrito de invitado pasa a mi cuenta

Es el comportamiento esperado. Al iniciar sesion, `mergeGuestCartToApi` envia los productos guardados localmente al carrito del usuario en backend.

## Posibles mejoras

Ideas para evolucionar el frontend:

- Agregar tests para `flux.js`, `api/client.js` y componentes criticos.
- Agregar skeleton loaders para catalogo y detalle de producto.
- Usar `GET /api/products/:id` en `ProductDetail` para permitir recarga directa sin depender del store.
- Agregar paginacion o filtros avanzados por precio, stock y unidad.
- Agregar validacion mas completa en formularios admin.
- Mostrar estados de carga en todas las acciones async.
- Agregar confirmacion visual al eliminar productos en admin sin usar `window.confirm`.
- Separar acciones del store por dominios: auth, cart, products, orders.
- Agregar manejo de refresh token si el backend lo implementa.
- Agregar tests end-to-end para los flujos principales.
- Mejorar accesibilidad de emojis decorativos con `aria-hidden`.
- Agregar pantalla 404 para rutas no definidas.
- Agregar control de stock al aumentar cantidades en carrito.

## Resumen tecnico

La carpeta `tienda-frontend` implementa una tienda React completa conectada a una API Flask. Su nucleo esta compuesto por `App.js` para rutas, `flux.js` para estado global, `injectContext.js` para proveer contexto y `api/client.js` para centralizar requests HTTP.

El frontend puede mostrar catalogo sin backend gracias al fallback local, pero las funcionalidades reales de usuario, carrito persistido, favoritos, pedidos y administracion dependen del servidor. La configuracion principal esta en `.env` mediante `REACT_APP_BACKEND_URL`.
