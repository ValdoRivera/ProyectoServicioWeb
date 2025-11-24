# Casa de Cambio Mundial API 

API REST construida con **Node.js + Express** que simula una casa de cambio con temática del Mundial 2026.  
Permite:

- Consultar tasas de cambio.
- Convertir montos entre divisas aplicando:
  - Promociones.
  - Bonos por ranking FIFA.
  - Días de partido.
- Gestionar usuarios con autenticación JWT.
- Exponer información de usuarios (pública y privada) según el endpoint.

---

## Tecnologías principales

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/) como ORM (configurado en `src/config/db.js`).
- [JWT](https://jwt.io/) para autenticación.
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) para hash de contraseñas.
- [winston](https://github.com/winstonjs/winston) para logging (ver `src/config/logger.js`).
- [express-validator](https://express-validator.github.io/) para validaciones en `auth`.   
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) + [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) para documentación. :contentReference[oaicite:17]{index=17}  

---

## Estructura del proyecto

```txt
src/
  config/
    db.js           # Configuración de Sequelize / BD
    logger.js       # Logger Winston
    worldcup.js     # Datos/constantes relacionados con el Mundial
  controllers/
    authController.js
    ratesController.js
    userController.js
  middlewares/
    authMiddleware.js
    errorHandler.js  # Middleware global de errores
    responseTime.js  # Log de tiempo de respuesta
  models/
    Conversion.js
    Usuario.js
  routes/
    index.js         # Monta las rutas de /api
    api/
      index.js       # Healthcheck y montaje de sub-rutas
      auth.route.js  # /api/auth
      rates.js       # /api/rates
      users.js       # /api/users
      user.js        # /api/user
  services/
    authService.js
    ratesService.js
    rankService.js
  utils/
    errors.js        # Clases de errores personalizados
index.js             # Punto de entrada, monta Express, Swagger y BD
````

---

## Configuración y ejecución

### 1. Clonar e instalar

```bash
git clone <URL_DEL_REPO>
cd <carpeta-del-proyecto>
npm install
```

### 2. Variables de entorno

Crear un archivo `.env` en la raíz con al menos:

```env
PORT=3000
JWT_SECRET=super-secreto
JWT_EXPIRES=1d

# Config BD según tu db.js (ejemplo)
DB_DIALECT=sqlite
DB_STORAGE=./data.sqlite

FIAT_DEFAULT_BASE=USD
RANK_USE_MOCK=true
```

*(Ajusta los nombres según lo que uses en `config/db.js` y otros archivos.)*

### 3. Levantar el servidor

En desarrollo:

```bash
npm run dev
```

o, si no tienes script dev:

```bash
node src/index.js
```

Al arrancar deberías ver algo como:

* Servidor: `http://localhost:3000`
* Swagger: `http://localhost:3000/api-docs` 

---

## Endpoints principales

### Auth

* `POST /api/auth/register` – Registrar usuario.
* `POST /api/auth/login` – Login, devuelve token JWT.

### Rates

* `GET /api/rates` – Tasas de cambio (base opcional `?base=USD`).
* `GET /api/rates/convert` – Conversión con promos, ranking y día de partido.
* `GET /api/rates/symbols` – Lista de símbolos/países mundialistas.
* `GET /api/rates/rank?team=Spain` – Ranking FIFA de un equipo.

### Users (protegidos con JWT)

Usan `Authorization: Bearer <token>`.

* `GET /api/users` – Lista usuarios (usar `?full=true` para más campos).
* `GET /api/users/:id` – Datos públicos de un usuario.
* `GET /api/user/:id` – Datos completos del usuario (endpoint más privado).

---

## Autenticación

1. Regístrate en `POST /api/auth/register`.
2. Haz login en `POST /api/auth/login`.
3. Copia el `token` JWT de la respuesta.
4. En Postman, agrega a tus requests protegidos:

```http
Authorization: Bearer <token>
```

---

## Manejo de errores

* Se usan clases de error personalizadas (`BaseError`, `BadRequestError`, etc.) en `src/utils/errors.js`.
* El middleware global `errorHandler.js`:

  * Loguea el error con Winston.
  * Devuelve JSON con `message` y `code`.
  * En modo no-producción también envía `stack` y `details`. 

---

Si quieres, en otro mensaje te puedo armar un **archivo de colección de Postman** (en JSON) para que lo importes directamente y tengas todas estas rutas listas para probar.
