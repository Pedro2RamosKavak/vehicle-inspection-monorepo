# Documentación Técnica — Review App

## Propósito

Frontend Next.js 14 para la revisión de inspecciones de vehículos. Permite listar, ver detalle y aprobar/rechazar inspecciones.

## Estructura
- `app/` — Páginas y componentes Next.js (App Router).
- `public/` — Archivos estáticos.
- `globals.css` — Estilos globales (Tailwind).

## Integración
- Usa `NEXT_PUBLIC_API_URL` para consumir el backend.
- Importa componentes de `@ui` y tipos de `@types`.

## Scripts
- `npm run dev` — Desarrollo local.
- `npm run build` — Build de producción.

## Notas
- Consume endpoints `/api/review/list` y `/api/review/:id` del backend.
- Permite aprobar/rechazar inspecciones vía PATCH.
