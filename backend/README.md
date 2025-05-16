# Backend de XT Headlines

Este es el backend para el portal de noticias XT Headlines, que se encarga de:
- Consumir fuentes RSS
- Almacenar noticias en MongoDB
- Proporcionar una API REST para el frontend

## Requisitos

- Node.js 18+
- MongoDB 5.0+

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
4. Configura las variables de entorno en el archivo `.env`

## Uso

- Iniciar el servidor en desarrollo:
  ```bash
  npm run dev
  ```

- Iniciar el servidor en producción:
  ```bash
  npm start
  ```

- Ejecutar el script de ingesta de noticias:
  ```bash
  npm run ingesta
  ```

## Estructura del proyecto

- `src/`
  - `models/` - Modelos de Mongoose
  - `rss/` - Servicios para consumir fuentes RSS
  - `scripts/` - Scripts de utilidad
  - `server.js` - Punto de entrada de la aplicación

## API Endpoints

- `GET /api/noticias` - Obtener todas las noticias
- `GET /api/noticias/categoria?categoria=NOMBRE` - Obtener noticias por categoría
- `GET /api/noticias/:id` - Obtener una noticia por ID
