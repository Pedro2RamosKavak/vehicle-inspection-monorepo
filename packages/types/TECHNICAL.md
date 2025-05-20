# Documentación Técnica — Types

## Propósito

Este package contiene los tipos TypeScript compartidos entre los frontends y el backend del monorepo.

## Estructura
- `index.ts` — Tipos principales (por ejemplo, `Inspection`).

## Uso

Importar en cualquier app del monorepo:

```ts
import { Inspection } from '@types';
```

## Notas
- Los tipos deben mantenerse sincronizados entre backend y frontends.
