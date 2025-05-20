# Documentación Técnica — Backend

## Propósito

Este módulo contiene el backend Express para la gestión de inspecciones de vehículos, subida de archivos a S3 y endpoints de revisión. Expone una API REST bajo el prefijo `/api` para ser consumida por los frontends y servicios externos.

## Estructura de carpetas

- `app.js` — Punto de entrada principal (Express).
- `lib/` — Funciones auxiliares (S3, utilidades).
- `test/` — Tests unitarios y de integración.

## Endpoints principales

- `POST   /api/submit`         — Solicita presigned URLs para subida de archivos.
- `POST   /api/submit/final`   — Guarda la inspección final en S3.
- `GET    /api/review/list`    — Lista inspecciones.
- `GET    /api/review/:id`     — Detalle de inspección.
- `PATCH  /api/review/:id`     — Aprueba/rechaza inspección.
- `DELETE /api/review/list`    — Borra todas las inspecciones (admin).

## Variables de entorno

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `BUCKET`
- `PORT` (por defecto 3000)

## Despliegue

- Local: `npm run dev` (desde raíz del monorepo)
- Producción: Deploy en Render/Fly/Railway, asegurando variables de entorno y puerto expuesto.

## Testing

- Tests en `test/` usando Jest.
- Cobertura mínima recomendada: 80%.

## Notas

- No modificar lógica de compresión ni S3 aquí; solo exponer endpoints y lógica de negocio.
- El backend debe ser consumido por los frontends vía `/api`. 