# Multimedia Monorepo

Monorepo Turborepo para inspección y revisión de vehículos.

## Estructura

- `apps/backend` — Backend Express (API REST, S3)
- `apps/form-app` — Frontend Next.js (formulario)
- `apps/review-app` — Frontend Next.js (reviewer)
- `packages/ui` — Componentes UI compartidos
- `packages/types` — Tipos TypeScript compartidos

## Instalación

```bash
git clone <repo-url>
cd <repo>
npm install
```

## Variables de entorno

- Copia `.env.example` en cada app y completa los valores necesarios.

## Scripts principales

```bash
npm run dev       # Desarrollo (todos los apps)
npm run build     # Build de producción
npm run lint      # Lint global
npm run test      # Tests globales
```

## Despliegue

- Frontends: Vercel (detecta apps/form-app y apps/review-app)
- Backend: Render/Fly/Railway (apps/backend)

## Notas

- Cada app/package tiene su propia documentación técnica (`TECHNICAL.md`).
- Los componentes y tipos compartidos se importan como `@ui` y `@types`.

# Sistema de Inspección de Vehículos

Aplicación web para realizar inspecciones vehiculares con capacidad de subir imágenes y videos a Google Drive a través de Zapier.

# 🚀 Nuevo Backend V1 "todo-en-S3"

## Instrucciones rápidas

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia `.env.example` a `.env` y completa tus credenciales AWS.
3. Corre el backend:
   ```bash
   npm run dev
   ```
4. Corre los tests:
   ```bash
   npm test
   ```

---

## Variables de entorno necesarias

```
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
AWS_REGION=sa-east-1
BUCKET=multimedia-form-pdr
```

---

## Endpoints principales

- `POST   /submit`         — Crea registro y retorna presigned URL para video
- `GET    /review/list`    — Lista revisiones
- `GET    /review/:id`     — Detalle de revisión
- `PATCH  /review/:id`     — Aprueba/rechaza revisión

---

## Características

- Formulario de inspección vehicular completo
- Captura de fotos de documentos y condiciones del vehículo
- Grabación de video
- Integración con Zapier para subir archivos a Google Drive
- Registro en Google Sheets a través de Zapier
- Organización por cliente (email y placa)

## Configuración para desarrollo

1. Clona este repositorio
2. Instala las dependencias:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Configura la variable de entorno para Zapier (ver sección siguiente)
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Variables de entorno

Crea un archivo `.env.local` con la siguiente variable:

```
NEXT_PUBLIC_ZAPIER_WEBHOOK_URL=tu_url_webhook_zapier
```

## Configuración en Vercel

Para desplegar en Vercel, sigue estos pasos:

1. Importa el repositorio en Vercel
2. Configura la variable de entorno NEXT_PUBLIC_ZAPIER_WEBHOOK_URL
3. Desplegar en la URL: https://virtuaiskavakbrasil.vercel.app/

## Configuración de Zapier

Para configurar Zapier correctamente:

1. Crea un nuevo Zap en Zapier
2. Configura el trigger como "Webhooks by Zapier" > "Catch Hook"
3. Copia la URL del webhook generada y pégala en tu archivo `.env.local`
4. Configura los pasos necesarios para:
   - Subir archivos a Google Drive (usando "Upload File from URL" o "Create File")
   - Guardar datos en Google Sheets (usando "Create Spreadsheet Row")

### Solución para archivos en formato Base64

El sistema puede enviar archivos en formato Base64 a Zapier. Para procesarlos:

1. Usa un paso "Code by Zapier" para convertir el contenido Base64 a un archivo
2. Luego usa "Google Drive" > "Create File" para guardar el archivo en Drive

Los campos importantes que recibirás en Zapier incluyen:
- `crlv_file_content` - Contenido Base64 del archivo CRLV
- `crlv_file_name` - Nombre del archivo CRLV
- `crlv_file_type` - Tipo MIME del archivo CRLV
- Y campos similares para otros archivos (video, fotos, etc.)

## Google Sheets

La aplicación está configurada para guardar datos en la hoja:
https://docs.google.com/spreadsheets/d/1vEI_R43cQcqShLA_63IgJ01hvI5wYDN28Ged3dHNkzY/edit?gid=0

Específicamente en la pestaña "Respuestas".

## Google Drive

Todos los archivos se guardarán en:
https://drive.google.com/drive/folders/18mfjOiDvyO1xkI0nXaYJNYVPohfeHaeV

## Estructura del proyecto

- `app/api/submit-form`: API para enviar datos a Zapier
- `app/api/zapier-webhook`: Webhook para recibir confirmaciones de Zapier
- `lib/zapier-service.ts`: Servicios para interactuar con Zapier
- `components/pasos`: Componentes del formulario por pasos 