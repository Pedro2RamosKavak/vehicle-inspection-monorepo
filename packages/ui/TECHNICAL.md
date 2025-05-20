# Documentación Técnica — UI

## Propósito

Este package contiene componentes de interfaz de usuario reutilizables (Button, Table, etc.) con estilos Tailwind, para ser usados en los frontends del monorepo.

## Estructura
- `button.tsx` — Componente botón reutilizable.
- `table.tsx` — Componente tabla reutilizable.

## Uso

Importar en cualquier app del monorepo:

```tsx
import { Button } from '@ui/button';
import { Table } from '@ui/table';
```

## Notas
- Los componentes siguen la guía de estilos de Tailwind.
- Se pueden extender o personalizar según las necesidades de cada app.
